import { createSlice } from "@reduxjs/toolkit";

const calculateTotal = (orderState) => {
  let result = 0;
  orderState.map((item) => (result += item.qty * item.price));
  return Number(result).toFixed(2);
};

export const initialState = {
  loading: false,
  error: null,
  order: JSON.parse(localStorage.getItem("orderItems")) || [],
  totalOrder: localStorage.getItem("orderItems") ? calculateTotal(JSON.parse(localStorage.getItem("orderItems"))) : 0,
};

const updateLocalStorage = (order) => {
  localStorage.setItem("orderItems", JSON.stringify(order));
  localStorage.setItem("totalOrder", JSON.stringify(calculateTotal(order)));
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    orderCreate: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.order = payload;
      updateLocalStorage(state.order);
      state.totalOrder = calculateTotal(state.order);
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
export const { setLoading, clearOrder, setError, orderCreate } = orderSlice.actions;
export default orderSlice.reducer;

export const orderSelector = (state) => state.order;
