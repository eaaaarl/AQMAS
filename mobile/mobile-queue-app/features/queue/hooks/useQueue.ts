import { useConfig } from "@/features/config/hooks/useConfig";
import { useGetCustomerTypeQuery } from "@/features/customer/api/customerApi";
import { CustomerTypeResponse } from "@/features/customer/api/interface";
import { Service } from "@/features/service/api/interface";
import { useAppDispatch } from "@/libs/redux/hooks";
import { useState } from "react";
import Toast from "react-native-toast-message";
import {
  queueApi,
  useCreateQueueDetailsMutation,
  useCreateQueueMutation,
  useGetCustomerNameCountQuery,
  useLazyAllServiceCountQuery,
  useLazyByServiceCountQuery,
  useLazyCountQueueQuery,
} from "../api/queueApi";

export const useQueue = () => {
  const dispatch = useAppDispatch();
  const [customerType, setCustomerType] = useState<CustomerTypeResponse | null>(
    null
  );
  const [selectedTransactions, setSelectedTransactions] = useState<Service[]>(
    []
  );
  const [showCustomerType, setShowCustomerType] = useState<boolean>(false);
  const [showCustomerName, setShowCustomerName] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState("");
  const [openConfirmationToast, setOpenConfirmationToast] = useState(false);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<string>("");
  const [shouldShowToastAfterModal, setShouldShowToastAfterModal] =
    useState(false);
  const [customerNameError, setCustomerNameError] = useState<string | null>(
    null
  );

  const {
    showAskCustomerType,
    showAskCustomerName,
    enabledSequenceByService,
    surveyMessage,
  } = useConfig();

  const [createQueue, { isLoading: isLoadingQueue }] = useCreateQueueMutation();
  const [createQueueDetails, { isLoading: isLoadingDetails }] =
    useCreateQueueDetailsMutation();
  const { data: customerTypeData, isError: customerTypeDataError } =
    useGetCustomerTypeQuery({
      is_show: "1",
    });

  const customerTypeDefaultData = customerTypeData?.find(
    (ctd) => ctd.default.data?.[0] === 1
  );
  const [triggerCountQueue] = useLazyCountQueueQuery();
  const singleServiceId =
    selectedTransactions.length === 1
      ? selectedTransactions[0]?.service_id
      : undefined;
  const [triggerByServiceCount] = useLazyByServiceCountQuery();
  const [triggerCountAllService] = useLazyAllServiceCountQuery();

  const { data: customerNameCount } = useGetCustomerNameCountQuery(
    { customerName: customerName },
    { skip: !customerName.trim() }
  );

  const toggleTransactions = (service: Service) => {
    setSelectedTransactions((prevTransactions) => {
      const existingIndex = prevTransactions.findIndex(
        (item) => item.service_id === service.service_id
      );
      if (existingIndex !== -1) {
        return prevTransactions.filter((_, index) => index !== existingIndex);
      } else {
        return [...prevTransactions, service];
      }
    });
  };

  const handleSubmitReceipt = async () => {
    if (showAskCustomerType && !customerType) {
      setShowCustomerType(true);
      return;
    }

    if (showAskCustomerName && !customerName.trim()) {
      setShowCustomerName(true);
      return;
    }

    await callCreateQueue();
  };

  const handleSetCustomerName = (name: string) => {
    setCustomerName(name);
  };

  const handleCancelName = () => {
    setShowCustomerName(false);
    setCustomerName("");
    setCustomerNameError("");
  };

  const handleCustomerNameConfirm = async () => {
    if (!customerName.trim()) {
      setCustomerNameError("Customer name is required");
      return;
    }

    if ((customerNameCount?.count ?? 0) > 0) {
      setCustomerNameError("This name is already in use. Please try another.");
      return;
    }

    setCustomerNameError(null);
    setShowCustomerName(false);
    setTimeout(() => callCreateQueue(), 100);
  };

  const handleCancelType = () => {
    setShowCustomerType(false);
    setCustomerType(null);
  };

  const handleSetCustomerType = (customer: CustomerTypeResponse) => {
    setCustomerType(customer);
  };

  const handleCustomerTypeConfirm = async () => {
    if (!customerType) {
      return;
    }

    setShowCustomerType(false);

    setTimeout(async () => {
      if (showAskCustomerName && !customerName.trim()) {
        setShowCustomerName(true);
      } else {
        await callCreateQueue();
      }
    }, 100);
  };

  const handleOpenConfirmationToast = () => {
    setOpenConfirmationToast(true);
  };

  const handleCloseConfirmationToast = () => {
    setOpenConfirmationToast(false);
  };

  const handleOpenTicketModal = () => {
    setOpenTicketModal(true);
  };

  const handleCloseTicketModal = () => {
    setOpenTicketModal(false);
    setCurrentTicket("");
    setCustomerName("");

    if (shouldShowToastAfterModal) {
      setShouldShowToastAfterModal(false);
      setTimeout(() => {
        handleOpenConfirmationToast();
      }, 300);
    }
  };

  const callCreateQueue = async () => {
    try {
      if (
        showAskCustomerName &&
        customerName.trim() &&
        (customerNameCount?.count ?? 0) > 0
      ) {
        Toast.show({
          type: "error",
          text1: "Customer Name Exists",
          text2:
            "This customer name is already in use. Please use a different name.",
          visibilityTime: 3000,
        });
        return;
      }

      const ticket = await generateTicketNumber();
      if (!ticket) {
        throw new Error("Failed to generate ticket number");
      }

      console.log("🎫 Creating main queue entry...");
      const mainQueuePayload = {
        customerName: customerName ?? "",
        transId: ticket,
        typeId:
          customerType?.type_id ?? Number(customerTypeDefaultData?.type_id),
        singleTransOnly: selectedTransactions.length === 1 ? 1 : 0,
        transStatus: 0,
      };

      await createQueue(mainQueuePayload).unwrap();
      console.log("✅ Main queue entry created successfully");

      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("📋 Creating queue details...");
      const queueDetailsPayload = selectedTransactions.map((service) => ({
        trans_id: ticket,
        service_id: service?.service_id,
      }));

      await createQueueDetails(queueDetailsPayload).unwrap();
      console.log("✅ Queue details created successfully");

      await handleSuccessFlow(ticket);
    } catch (error) {
      console.error("❌ Queue creation process failed:", error);
      await handleErrorFlow(error);
      throw error;
    }
  };

  const generateTicketNumber = async () => {
    try {
      let ByServiceCount;
      let CountAllService;
      let CountSequence;
      let ticket;

      const singleTransactions = selectedTransactions.length === 1;

      if (Number(customerTypeDefaultData?.own_sequence?.data?.[0]) === 1) {
        const { data: freshCountQueue } = await triggerCountQueue({
          customer_type:
            customerTypeDefaultData?.type_id ?? customerType?.type_id,
        });
        CountSequence = freshCountQueue?.[0]?.count || 0;
        const newCountSequence = Number(CountSequence) + 1;

        if (singleTransactions) {
          ticket = `${
            selectedTransactions?.[0]?.service_format
          }${newCountSequence}${
            customerTypeDefaultData?.suffix ?? customerType?.suffix
          }`;
        } else {
          ticket = `${newCountSequence}${
            customerTypeDefaultData?.suffix ?? customerType?.suffix
          }`;
        }
      } else {
        if (!enabledSequenceByService) {
          const { data: freshAllServiceCount } = await triggerCountAllService();
          CountAllService = freshAllServiceCount?.[0]?.count || 0;
          const newCountAllService = Number(CountAllService) + 1;

          if (singleTransactions) {
            ticket = `${
              selectedTransactions?.[0]?.service_format
            }${newCountAllService}${
              customerType?.suffix ?? customerTypeDefaultData?.suffix
            }`;
          } else {
            ticket = `${newCountAllService}${
              customerType?.suffix ?? customerTypeDefaultData?.suffix
            }`;
          }
        } else {
          const { data: freshByServiceCount } = await triggerByServiceCount(
            singleServiceId as number
          );
          ByServiceCount = freshByServiceCount?.[0]?.count || 0;
          const newByServiceCount = Number(ByServiceCount) + 1;

          if (singleTransactions) {
            ticket = `${
              selectedTransactions?.[0]?.service_format
            }${newByServiceCount}${
              customerType?.suffix ?? customerTypeDefaultData?.suffix
            }`;
          } else {
            const { data: freshAllServiceCount } =
              await triggerCountAllService();
            CountAllService = freshAllServiceCount?.[0]?.count || 0;
            const newCountAllService = Number(CountAllService) + 1;
            ticket = `${newCountAllService}${
              customerType?.suffix ?? customerTypeDefaultData?.suffix
            }`;
          }
        }
      }

      console.log("🎯 Generated ticket:", ticket);
      return ticket;
    } catch (error) {
      console.error("❌ Failed to generate ticket number:", error);
      return null;
    }
  };

  const handleSuccessFlow = async (ticket: string) => {
    try {
      setCurrentTicket(ticket);
      const shouldShowTicket = ticket;
      const shouldShowToast = surveyMessage !== "";

      if (shouldShowTicket && shouldShowToast) {
        setShouldShowToastAfterModal(true);
        handleOpenTicketModal();
      } else if (shouldShowTicket) {
        handleOpenTicketModal();
      } else if (shouldShowToast) {
        handleOpenConfirmationToast();
      }

      resetFormState();

      dispatch(queueApi.util.invalidateTags(["Queue"]));
    } catch (error) {
      console.error("❌ Error in success flow:", error);
    }
  };

  const handleErrorFlow = async (error: any) => {
    try {
      const isForeignKeyError =
        error?.message?.includes("foreign key") ||
        error?.status === 409 ||
        error?.data?.message?.includes("constraint");

      if (isForeignKeyError) {
        Toast.show({
          type: "error",
          text1: "Database Sync Error",
          text2: "Please try again in a moment. The system is updating.",
          visibilityTime: 4000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An Error occurred!",
          text2: "Please contact administrator",
          visibilityTime: 5000,
        });
      }

      // Reset form state on error
      resetFormState();
    } catch (resetError) {
      console.error("❌ Error in error handling:", resetError);
    }
  };

  // Reset form state helper
  const resetFormState = () => {
    setCustomerType(null);
    setSelectedTransactions([]);
    setShowCustomerType(false);
    setShowCustomerName(false);
  };

  return {
    // DATA
    customerNameError,
    selectedTransactions,
    customerType,
    customerName,
    showCustomerType,
    showCustomerName,
    isLoadingMutation: isLoadingQueue || isLoadingDetails,
    openConfirmationToast,
    surveyMessage,
    openTicketModal,
    currentTicket,
    customerTypeDataError,

    // HANDLERS
    toggleTransactions,
    handleSubmitReceipt,
    handleCancelType,
    handleSetCustomerType,
    handleCustomerTypeConfirm,
    handleSetCustomerName,
    handleCancelName,
    handleCustomerNameConfirm,
    setSelectedTransactions,
    setCustomerType,
    handleCloseConfirmationToast,
    handleOpenConfirmationToast,
    handleOpenTicketModal,
    handleCloseTicketModal,
  };
};
