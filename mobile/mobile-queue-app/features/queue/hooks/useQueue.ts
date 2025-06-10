import { useConfig } from "@/features/config/hooks/useConfig";
import { Service } from "@/features/service/api/interface";
import { useState } from "react";
import { Alert } from "react-native";
import { useCreateQueueMutation } from "../api/queueApi";

export const useQueue = () => {
  const { showAskCustomerName, showAskCustomerType } = useConfig();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showCustomerTypeModal, setShowCustomerTypeModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<Service[]>(
    []
  );

  const toggleTransaction = (service: Service) => {
    setSelectedTransactions((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.service_id === service.service_id
      );

      if (existingIndex !== -1) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, service];
      }
    });
  };

  const handlePrintReceipt = async () => {
    if (showAskCustomerType) {
      setShowCustomerTypeModal(true);
    }
  };

  const handleConfirmName = () => {
    if (customerName.trim()) {
      const transactionsWithCustomer = selectedTransactions.map(
        (transaction) => ({
          ...transaction,
          customer_name: customerName.trim(),
        })
      );

      Alert.alert(JSON.stringify(transactionsWithCustomer));

      setShowNameModal(false);
      setCustomerName("");
    } else {
      Alert.alert("Error", "Please enter a customer name");
    }
  };

  const handleCancelName = () => {
    setShowNameModal(false);
    setCustomerName("");
  };

  const [createQueue, { isLoading }] = useCreateQueueMutation();

  const callCreateQueue = async () => {
    try {
      const currentDate = new Date();
      const queuePromises = selectedTransactions.map(async (service) => {
        return await createQueue({
          trans_id: `${service.service_format}_${Date.now()}_${
            service.service_id
          }`,
          trans_date: currentDate,
        });
      });

      const results = await Promise.all(queuePromises);

      console.log(`Created ${results.length} queue entries:`, results);
      alert(
        `Successfully created ${selectedTransactions.length} queue tickets!`
      );

      setSelectedTransactions([]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleSubmit = () => {
    callCreateQueue();
  };

  return {
    handleSubmit,
    isLoadingQueing: isLoading,
    setSelectedTransactions,
    selectedTransactions,
    toggleTransaction,

    handleCancelName,
    handlePrintReceipt,
    handleConfirmName,
    showNameModal,
    customerName,
    setCustomerName,

    showCustomerTypeModal,
  };
};
