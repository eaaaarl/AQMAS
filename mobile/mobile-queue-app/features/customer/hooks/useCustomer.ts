import { useGetCustomerTypeQuery } from "../api/customerApi";

export const useCustomer = () => {
  const { data } = useGetCustomerTypeQuery({ is_show: "1" });

  const customerTypeDefault = data?.find((dt) => dt.default.data?.[0]);

  return {
    customerTypeDefault,
  };
};
