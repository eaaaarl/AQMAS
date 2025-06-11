import { useConfig } from "@/features/config/hooks/useConfig";
import { CustomerTypeResponse } from "@/features/customer/api/interface";
import { Service } from "@/features/service/api/interface";
import { useEffect, useState } from "react";

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

  // Debug: Track customerType changes
  useEffect(() => {
    console.log("🔍 CustomerType state changed:", customerType);
  }, [customerType]);

  // Debug: Track customerName changes
  useEffect(() => {
    console.log("🔍 CustomerName state changed:", customerName);
  }, [customerName]);

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
    console.log("📝 handleSubmitReceipt - Current state:", {
      showAskCustomerType,
      customerType: customerType?.type_name,
      showAskCustomerName,
      customerName,
    });

    if (showAskCustomerType && !customerType) {
      console.log("❓ Showing customer type modal");
      setShowCustomerType(true);
      return;
    }

    if (showAskCustomerName && !customerName.trim()) {
      console.log("❓ Showing customer name modal");
      setShowCustomerName(true);
      return;
    }

    console.log("✅ All requirements met, calling createQueue");
    await callCreateQueue();
  };

  const handleSetCustomerName = (name: string) => {
    console.log("📝 Setting customer name:", name);
    setCustomerName(name);
  };

  const handleCancelName = () => {
    console.log("❌ Canceling name modal");
    setShowCustomerName(false);
    setCustomerName("");
  };

  const handleCustomerNameConfirm = async () => {
    console.log("✅ Confirming customer name:", customerName);
    console.log("🔍 CustomerType at name confirm:", customerType);

    if (!customerName.trim()) {
      return;
    }
    setShowCustomerName(false);

    // Add a small delay to ensure state is updated
    setTimeout(async () => {
      console.log("🔍 CustomerType after timeout:", customerType);
      await callCreateQueue();
    }, 100);
  };

  const handleCancelType = () => {
    console.log("❌ Canceling type modal");
    setShowCustomerType(false);
    setCustomerType(null);
  };

  const handleSetCustomerType = (customer: CustomerTypeResponse) => {
    console.log("📝 Setting customer type:", customer);
    setCustomerType(customer);
  };

  const handleCustomerTypeConfirm = async () => {
    console.log("✅ Confirming customer type:", customerType);

    if (!customerType) {
      console.error("❌ No customer type selected");
      return;
    }

    setShowCustomerType(false);

    // Add a small delay to ensure state is updated
    setTimeout(async () => {
      console.log("🔍 CustomerType after type confirm timeout:", customerType);

      if (showAskCustomerName && !customerName.trim()) {
        console.log("❓ Need customer name, showing name modal");
        setShowCustomerName(true);
      } else {
        console.log("✅ No name needed, calling createQueue");
        await callCreateQueue();
      }
    }, 100);
  };

  const resetForm = () => {
    console.log("🔄 Resetting form");
    setCustomerType(null);
    setCustomerName("");
    setSelectedTransactions([]);
    setShowCustomerType(false);
    setShowCustomerName(false);
  };

  const callCreateQueue = async () => {
    console.log("🏗️ callCreateQueue START");
    console.log("🔍 Current customerType in callCreateQueue:", customerType);
    console.log("🔍 Current customerName in callCreateQueue:", customerName);

    try {
      const timestamp = Date.now();
      const queue = selectedTransactions.map((service, index) => ({
        trans_id: `${service.service_format}${timestamp}${index}${
          customerType?.suffix || ""
        }`,
        trans_date: new Date().toISOString(),
        type_id: customerType?.type_id,
        employee_id: null,
        time_served: null,
        counter_no: null,
        trans_status: 0,
        single_trans_only: selectedTransactions.length === 1 ? 1 : 0,
      }));

      console.log("📤 Queue submission:", {
        customerName,
        customerType: customerType?.type_name,
        customerTypeId: customerType?.type_id,
        queue,
      });

      // DON'T reset form immediately - let's see what happens first
      resetForm();
    } catch (error) {
      console.error("❌ Submission failed:", error);
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
