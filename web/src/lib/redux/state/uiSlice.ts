import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UIComponentType = 'modal' | 'toast' | 'drawer' | 'popover';

export interface UIComponentState {
  id?: string;
  type: UIComponentType;
  open: boolean;
  title?: string;
  message?: string;
  duration?: number;
  variant?: 'default' | 'destructive' | 'success';
  data?: Record<string, unknown>;
}

export interface UIState {
  components: UIComponentState[];
}

const initialState: UIState = {
  components: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openComponent: (state, action: PayloadAction<UIComponentState>) => {
      state.components.push(action.payload);
    },
    closeComponent: (state, action: PayloadAction<{ type: UIComponentType; id?: string }>) => {
      const { type, id } = action.payload;
      if (id) {
        state.components = state.components.filter(component => !(component.type === type && component.id === id));
      } else {
        state.components = state.components.filter(component => component.type !== type);
      }
    },
    updateComponent: (
      state,
      action: PayloadAction<{ type: UIComponentType; id?: string; updates: Partial<UIComponentState> }>
    ) => {
      const { type, id, updates } = action.payload;
      const component = state.components.find(
        c => c.type === type && (id ? c.id === id : true)
      );
      if (component) {
        Object.assign(component, updates);
      }
    },
    resetUI: () => initialState,
  },
});

export const { openComponent, closeComponent, updateComponent, resetUI } = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
