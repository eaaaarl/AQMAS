import { useConfig } from "@/features/config/hooks/useConfig";
import { useGetCustomerTypeQuery } from "@/features/customer/api/customerApi";
import { CustomerTypeResponse } from "@/features/customer/api/interface";
import { Service } from "@/features/service/api/interface";
import { useAppDispatch } from "@/libs/redux/hooks";
import { useState } from "react";
import Toast from "react-native-toast-message";
import {
  createQueueDetailsPayload,
  createQueuePayload,
} from "../api/interface";
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

  const dispatch = useAppDispatch();
  const {
    showAskCustomerType,
    showAskCustomerName,
    enabledSequenceByService,
    surveyMessage,
  } = useConfig();
  const [createQueue, { isLoading: isLoadingQueue }] = useCreateQueueMutation();
  const [createQueueDetails, { isLoading: isLoadingDetails }] =
    useCreateQueueDetailsMutation();

  const { data: customerTypeData } = useGetCustomerTypeQuery({
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

  const resetForm = () => {
    setCustomerType(null);
    setSelectedTransactions([]);
    setShowCustomerType(false);
    setShowCustomerName(false);
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

      let ByServiceCount;
      let CountAllService;
      let CountSequence;
      let ticket: string | undefined;

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
          console.log("Customer Type have sequence 1 transactions:", ticket);
        } else {
          ticket = `${newCountSequence}${
            customerTypeDefaultData?.suffix ?? customerType?.suffix
          }`;
          console.log("Customer Type have sequence more transactions:", ticket);
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
            console.log(
              "if not enabled sequence by service single transactions:",
              ticket
            );
          } else {
            ticket = `${newCountAllService}${
              customerType?.suffix ?? customerTypeDefaultData?.suffix
            }`;
            console.log(
              "if not enabled sequence by service more transactions:",
              ticket
            );
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
            console.log(
              "if enabled sequence by service single transactions:",
              ticket
            );
          } else {
            const { data: freshAllServiceCount } =
              await triggerCountAllService();
            CountAllService = freshAllServiceCount?.[0]?.count || 0;
            const newCountAllService = Number(CountAllService) + 1;
            ticket = `${newCountAllService}${
              customerType?.suffix ?? customerTypeDefaultData?.suffix
            }`;
            console.log(
              "if enabled sequence by service more transactions:",
              ticket
            );
          }
        }
      }

      const mainQueuePayload: createQueuePayload = {
        customerName: customerName,
        transId: ticket as string,
        typeId:
          customerType?.type_id ?? Number(customerTypeDefaultData?.type_id),
        singleTransOnly: selectedTransactions.length === 1 ? 1 : 0,
        transStatus: 0,
      };

      const queueDetailsPayload: createQueueDetailsPayload[] =
        selectedTransactions.map((service) => ({
          trans_id: ticket as string,
          service_id: service?.service_id,
        }));

      await Promise.all([
        createQueue(mainQueuePayload).unwrap(),
        createQueueDetails(queueDetailsPayload).unwrap(),
      ]);

      dispatch(queueApi.util.invalidateTags(["Queue"]));

      setCurrentTicket(ticket as string);
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

      resetForm();
    } catch (error) {
      console.error("❌ Queue creation process failed:", error);
      resetForm();
      throw error;
    }
  };

  return {
    // DATA
    customerNameError,
    selectedTransactions,
    customerType,
    customerName,
    showCustomerType,
    showCustomerName,
    isLoading: isLoadingQueue || isLoadingDetails,
    openConfirmationToast,
    surveyMessage,
    openTicketModal,
    currentTicket,

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
    resetForm,
    handleCloseConfirmationToast,
    handleOpenConfirmationToast,
    handleOpenTicketModal,
    handleCloseTicketModal,
  };
};
