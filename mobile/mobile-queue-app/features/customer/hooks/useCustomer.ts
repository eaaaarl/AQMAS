import { useGetCustomerTypeQuery } from "../api/customerApi";

export const useCustomer = () => {
  const { data } = useGetCustomerTypeQuery({
    is_show: "1",
  });

  const customerTypeDefault = data?.find((ctd) => ctd.type_id === 3) ?? [];
  return {
    customerTypeDefault,
  };
};
