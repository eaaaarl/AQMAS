import { useGetCustomerTypeQuery } from "../api/customerApi";

export const useCustomer = () => {
  const { data: getCustomerDefault } = useGetCustomerTypeQuery({
    is_show: "1",
  });

  const customerTypeDefault = getCustomerDefault?.find(
    (gcd) => gcd.default.data?.[0]
  );

  return {
    customerTypeDefault,
  };
};
