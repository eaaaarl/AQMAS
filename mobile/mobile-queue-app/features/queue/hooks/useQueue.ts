import { useConfig } from "@/features/config/hooks/useConfig";
import { useGetCustomerTypeQuery } from "@/features/customer/api/customerApi";
import { CustomerTypeResponse } from "@/features/customer/api/interface";
import { Service } from "@/features/service/api/interface";
import { useAppDispatch } from "@/libs/redux/hooks";
import { useState } from "react";
import {
  createQueueDetailsPayload,
  createQueuePayload,
} from "../api/interface";
import {
  queueApi,
  useAllServiceCountQuery,
  useByServiceCountQuery,
  useCountQueueQuery,
  useCreateQueueDetailsMutation,
  useCreateQueueMutation,
} from "../api/queueApi";

export const useQueue = () => {
  const dispatch = useAppDispatch();

  const {
    showAskCustomerType,
    showAskCustomerName,
    enabledSequenceByService,
    surveyMessage,
    enabledTicket,
  } = useConfig();

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

  const [createQueue, { isLoading: isLoadingQueue }] = useCreateQueueMutation();
  const [createQueueDetails, { isLoading: isLoadingDetails }] =
    useCreateQueueDetailsMutation();

  const { data: countQueue } = useCountQueueQuery({
    customer_type: customerType?.type_id || 0,
    own_sequence:
      customerType?.own_sequence.data?.[0] === 1
        ? customerType.own_sequence.data?.[0]
        : "",
  });
  const { data: allServiceCount } = useAllServiceCountQuery();
  const { data: customerTypeDefault } = useGetCustomerTypeQuery({
    is_show: "1",
  });

  const singleServiceId =
    selectedTransactions.length === 1
      ? selectedTransactions[0]?.service_id
      : undefined;

  const { data: byServiceCount } = useByServiceCountQuery(
    singleServiceId as number,
    { skip: !singleServiceId }
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
      return;
    }
    setShowCustomerName(false);

    setTimeout(async () => {
      await callCreateQueue();
    }, 100);
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

  const customerTypeDef = customerTypeDefault?.find(
    (ctd) => ctd.default.data?.[0]
  );

  const callCreateQueue = async () => {
    try {
      let ByServiceCount;
      let CountAllService;
      let CountSequence;
      let ticket: string | undefined;

      const singleTransactions = selectedTransactions.length === 1;

      if (customerType?.own_sequence.data?.[0] === 1) {
        CountSequence = countQueue?.find((cq) => cq)?.count || 0;
        const newCountSequence = Number(CountSequence) + 1;
        if (singleTransactions) {
          ticket = `${
            selectedTransactions?.[0].service_format
          }${newCountSequence}${customerType?.suffix ?? ""}`;
          console.log("Customer Type have sequence 1 transactions:", ticket);
        } else {
          ticket = `${newCountSequence}${customerType.suffix ?? ""}`;
          console.log("Customer Type have sequence more transactions:", ticket);
        }
      } else {
        if (!enabledSequenceByService) {
          CountAllService = allServiceCount?.find((asc) => asc)?.count || 0;
          const newCountAllService = Number(CountAllService) + 1;
          if (singleTransactions) {
            ticket = `${
              selectedTransactions?.[0].service_format
            }${newCountAllService}${customerType?.suffix ?? ""}`;
            console.log(
              "if not enabled sequence by service single transactions:",
              ticket
            );
          } else {
            ticket = `${newCountAllService}${customerType?.suffix ?? ""}`;
            console.log(
              "if not enabled sequence by service more transactions:",
              ticket
            );
          }
        } else {
          ByServiceCount = byServiceCount?.find((bsc) => bsc)?.count || 0;
          const newByServiceCount = Number(ByServiceCount) + 1;
          if (singleTransactions) {
            ticket = `${
              selectedTransactions?.[0].service_format
            }${newByServiceCount}${customerType?.suffix ?? ""}`;
            console.log(
              "if enabled sequence by service single transactions:",
              ticket
            );
          } else {
            CountAllService = allServiceCount?.find((asc) => asc)?.count || 0;
            const newCountAllService = Number(CountAllService) + 1;
            ticket = `${newCountAllService}${customerType?.suffix ?? ""}`;
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
        typeId: customerType?.type_id ?? Number(customerTypeDef?.type_id),
        singleTransOnly: selectedTransactions.length === 1 ? 1 : 0,
        transStatus: 0,
      };

      const queueDetailsPayload: createQueueDetailsPayload[] =
        selectedTransactions.map((service) => ({
          trans_id: ticket as string,
          service_id: service.service_id,
        }));

      console.log("Queue DATA", mainQueuePayload);
      console.log("Queue Detail DATA", queueDetailsPayload);

      await Promise.all([
        createQueue(mainQueuePayload).unwrap(),
        createQueueDetails(queueDetailsPayload).unwrap(),
      ]);

      dispatch(queueApi.util.invalidateTags(["Queue"]));

      setCurrentTicket(ticket as string);
      const shouldShowTicket = enabledTicket && ticket;
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
