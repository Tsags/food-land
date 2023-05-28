import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  error: null,
  orderInfo: {},
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    clearOrder: (state) => {
      state.loading = initialState.loading;
      state.error = initialState.error;
      state.orderInfo = initialState.orderInfo;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
  },
});
export const { setLoading, clearOrder, setError } = orderSlice.actions;
export default orderSlice.reducer;

export const orderSelector = (state) => state.order;
