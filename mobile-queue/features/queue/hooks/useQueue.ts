import { useConfig } from "@/features/config/hooks/useConfig";
import { useGetCustomerTypeQuery } from "@/features/customer/api/customerApi";
import { CustomerTypeResponse } from "@/features/customer/api/interface";
import { Service } from "@/features/service/api/interface";
import { useAppDispatch } from "@/libs/redux/hooks";
import EscPosEncoder from "@manhnd/esc-pos-encoder";
import { useState } from "react";
import RNBluetoothClassic from "react-native-bluetooth-classic";
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
    enabledPriority,
    enabledPrintCustomerName,
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
    await callCreateQueue();
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

    if (showAskCustomerName && !customerName.trim()) {
      setShowCustomerName(true);
    } else {
      await callCreateQueue();
    }
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

  const getConnectedDevice = async () => {
    try {
      const devices = await RNBluetoothClassic.getConnectedDevices();
      return devices.length > 0 ? devices[0] : null;
    } catch (error) {
      console.error("Error getting connected device:", error);
      return null;
    }
  };

  const thermalTicket = async (data: {
    ticketNumber: string;
    customerName: string;
    service: string[];
    customerType?: string;
    dateTime?: string;
  }) => {
    const encoder = new EscPosEncoder();
    //  const currentDateTime = new Date().toLocaleString();
    const serviceName = data.service.length > 0 ? data.service.join(" | ") : "";

    const result = encoder
      .initialize()
      .codepage("cp437")
      .align("left")
      // Header with timestamp
      .size(0)
      .line(`${data.dateTime}`)
      .newline()
      .align("center")
      .raw([0x1d, 0x21, 0x66])
      .bold(true)
      .line(data.ticketNumber)
      .raw([0x1d, 0x21, 0x00]) // Reset size after big text
      .newline()
      .align("center")
      .size(0)
      .line(`${enabledPrintCustomerName ? data.customerName : ""}`) // Fixed template literal
      .line(`${serviceName}`)
      .newline()
      .size(0)
      .line(`${enabledPriority ? "PRIORITY" : ""}`) // Fixed template literal
      .line("- - - - - - - - - - - - - - - - - - - - - - - -")
      .cut()
      .encode();
    return result;
  };

  const printThermalTicket = async (data: {
    ticketNumber: string;
    customerName: string;
    service: string[];
    customerType?: string;
    dateTime?: string;
  }) => {
    try {
      // Get connected device
      const connectedDevice = await getConnectedDevice();

      if (!connectedDevice) {
        console.log(
          "⚠️ No thermal printer connected. Ticket created but not printed."
        );
        Toast.show({
          type: "info",
          text1: "Ticket Created",
          text2: "No printer connected. Ticket number: " + data.ticketNumber,
          visibilityTime: 3000,
        });
        return;
      }

      console.log("🖨️ Printing thermal ticket...");

      // Generate thermal ticket data
      const thermalData = await thermalTicket(data);
      const base64Data = btoa(
        String.fromCharCode(...new Uint8Array(thermalData))
      );

      // Send to printer
      const result = await RNBluetoothClassic.writeToDevice(
        connectedDevice.address,
        base64Data,
        "base64"
      );

      if (result) {
        console.log("✅ Thermal ticket printed successfully");
        Toast.show({
          type: "success",
          text1: "Ticket Printed",
          text2: `Ticket ${data.ticketNumber} printed successfully`,
          visibilityTime: 2000,
        });
      } else {
        console.log("❌ Failed to print thermal ticket");
        Toast.show({
          type: "error",
          text1: "Print Failed",
          text2: "Could not print ticket. Please check printer connection.",
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error("❌ Thermal printing error:", error);
      Toast.show({
        type: "error",
        text1: "Print Error",
        text2: "Error printing ticket: " + error.message,
        visibilityTime: 3000,
      });
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

      const mainQueuePayload = {
        customerName: customerName ?? "",
        transId: ticket,
        typeId:
          customerType?.type_id ?? Number(customerTypeDefaultData?.type_id),
        singleTransOnly: selectedTransactions.length === 1 ? 1 : 0,
        transStatus: 0,
      };

      await createQueue(mainQueuePayload).unwrap();

      const queueDetailsPayload = selectedTransactions.map((service) => ({
        trans_id: ticket,
        service_id: service?.service_id,
      }));

      await createQueueDetails(queueDetailsPayload).unwrap();

      await handleSuccessFlow(ticket);

      await printThermalTicket({
        ticketNumber: ticket,
        customerName: customerName || "",
        service: selectedTransactions.map((sv) => sv.service_name),
        dateTime: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
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
        resetFormState();
      } else {
        Toast.show({
          type: "error",
          text1: "An Error occurred!",
          text2: "Please contact administrator",
          visibilityTime: 5000,
        });
        resetFormState();
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
