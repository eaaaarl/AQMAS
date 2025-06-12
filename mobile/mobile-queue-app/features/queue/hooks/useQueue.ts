import { useConfig } from "@/features/config/hooks/useConfig";
import { CustomerTypeResponse } from "@/features/customer/api/interface";
import { Service } from "@/features/service/api/interface";
import { useAppDispatch } from "@/libs/redux/hooks";
import { useState } from "react";
import Toast from "react-native-toast-message";
import {
    createQueueDetailsPayload,
    createQueuePayload2,
} from "../api/interface";
import {
    queueApi,
    useCountQueueQuery,
    useCreateQueueDetailsMutation,
    useCreateQueueMutation,
} from "../api/queueApi";

export const useQueue = () => {
  const { showAskCustomerType, showAskCustomerName } = useConfig();
  const [customerType, setCustomerType] = useState<CustomerTypeResponse | null>(
    null
  );
  const [selectedTransactions, setSelectedTransactions] = useState<Service[]>(
    []
  );
  const [showCustomerType, setShowCustomerType] = useState<boolean>(false);
  const [showCustomerName, setShowCustomerName] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState("");

  const [createQueue, { isLoading: isLoadingQueue }] = useCreateQueueMutation();
  const [createQueueDetails, { isLoading: isLoadingDetails }] =
    useCreateQueueDetailsMutation();
  const { data: countQueue } = useCountQueueQuery();
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

  const resetForm = () => {
    setCustomerType(null);
    setCustomerName("");
    setSelectedTransactions([]);
    setShowCustomerType(false);
    setShowCustomerName(false);
  };
  const dispatch = useAppDispatch();
  const callCreateQueue = async () => {
    try {
      let currentCount = countQueue?.count ?? 0;
      const newCount = currentCount + 1;

      let transId: string;
      if (selectedTransactions.length === 1) {
        transId = `${selectedTransactions[0].service_format}${newCount}${customerType?.suffix}`;
      } else {
        transId = `${newCount}${customerType?.suffix}`;
      }

      // const mainQueueData: createQueuePayload = {
      //   transId: transId,
      //   customerName: customerName,
      //   typeId: customerType?.type_id ?? 0,
      //   singleTransOnly: selectedTransactions.length === 1 ? 1 : 0,
      //   transStatus: 0,
      // };

      const mainQueueData: createQueuePayload2 = {
        customer_name: customerName,
        trans_id: transId,
        type_id: customerType?.type_id ?? 0,
        single_trans_only: selectedTransactions.length === 1 ? 1 : 0,
        trans_status: 0,
      };

      const mainQueue = await createQueue(mainQueueData).unwrap();

      const queueDetailsPayload: createQueueDetailsPayload[] =
        selectedTransactions.map((service) => ({
          trans_id: transId,
          service_id: service.service_id,
        }));

      const queueDetailsResult = await createQueueDetails(
        queueDetailsPayload
      ).unwrap();

      dispatch(queueApi.util.invalidateTags(["Queue"]));
      resetForm();

      Toast.show({
        type: "success",
        text1: "Queue Created!",
        // text2: queueName
        //   ? `"${queueName}" has been created successfully`
        //   : "Your queue has been created successfully",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
      return {
        mainQueue,
        queueDetails: queueDetailsResult,
        newCount,
      };
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
  };
};
