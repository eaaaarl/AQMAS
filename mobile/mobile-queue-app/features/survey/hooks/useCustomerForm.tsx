import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import { resetCustomerSurvey, setAddress, setContact, setName, setOpenCustomerSurveyModal, setReference } from "@/libs/redux/state/customerSurveySlice";

export const useCustomerForm = () => {
    const dispatch = useAppDispatch();
    const { address, contact, name, reference, openCustomerSurveyModal } = useAppSelector((state) => state.customerSurvey);

    const onChangeInput = (field: string, value: string) => {
        switch (field) {
            case 'name':
                dispatch(setName(value));
                break;
            case 'address':
                dispatch(setAddress(value));
                break;
            case 'contact':
                dispatch(setContact(value));
                break;
            case 'reference':
                dispatch(setReference(value));
                break;
            default:
                break;
        }
    };

    const handleOpen = () => {
        dispatch(setOpenCustomerSurveyModal(true));
    };

    const handleClose = () => {
        dispatch(resetCustomerSurvey());
        dispatch(setOpenCustomerSurveyModal(false));
    };

    const getFormData = () => ({
        name,
        address,
        contact,
        reference
    });

    return {
        openCustomerFormModal: openCustomerSurveyModal,
        formData: { name, address, contact, reference },
        onChangeInput,
        handleOpen,
        handleClose,
        getFormData
    };
};