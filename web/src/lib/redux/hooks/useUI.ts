import { useAppDispatch, useAppSelector } from "../hooks";
import {
  type UIComponentState,
  type UIComponentType,
  openComponent,
  closeComponent,
  updateComponent,
} from "../state/uiSlice";
import { useCallback, useMemo } from "react";

// Hook to get all components of a specific type
export const useUIComponents = (type: UIComponentType) => {
  return useAppSelector((state) =>
    state.ui.components.filter((component) => component.type === type)
  );
};

// Hook to get a specific component by type and optional ID
export const useUIComponent = (type: UIComponentType, id?: string) => {
  return useAppSelector((state) =>
    state.ui.components.find(
      (component) =>
        component.type === type && (id ? component.id === id : true)
    )
  );
};

// Hook for managing a specific UI component
export const useUIComponentControl = (type: UIComponentType, id?: string) => {
  const dispatch = useAppDispatch();
  const component = useUIComponent(type, id);

  const open = useCallback(
    (props: Omit<UIComponentState, "type">) => {
      dispatch(
        openComponent({
          type,
          ...props,
          id,
        })
      );
    },
    [dispatch, type, id]
  );

  const close = useCallback(() => {
    dispatch(closeComponent({ type, id }));
  }, [dispatch, type, id]);

  const update = useCallback(
    (updates: Partial<UIComponentState>) => {
      dispatch(updateComponent({ type, id, updates }));
    },
    [dispatch, type, id]
  );

  return useMemo(
    () => ({
      isOpen: !!component?.open,
      component,
      open,
      close,
      update,
    }),
    [component, open, close, update]
  );
};

// Hook specifically for modals
export const useModal = (id?: string) => {
  return useUIComponentControl("modal", id);
};

// Hook specifically for toasts
export const useToast = (id?: string) => {
  return useUIComponentControl("toast", id);
};

// Hook specifically for drawers
export const useDrawer = (id?: string) => {
  return useUIComponentControl("drawer", id);
};

// Hook specifically for popovers
export const usePopover = (id?: string) => {
  return useUIComponentControl("popover", id);
};
