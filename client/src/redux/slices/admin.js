import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: null,
  userList: [],
  userRemoval: false,
  orders: [],
  orderRemoval: false,
  deliveredFlag: false,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    getUsers: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.userList = payload;
    },
    getOrders: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.orders = payload;
    },
    userDelete: (state) => {
      state.userRemoval = true;
      state.loading = false;
      state.error = null;
    },
    orderDelete: (state) => {
      state.orderRemoval = true;
      state.loading = false;
      state.error = null;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
      state.userRemoval = true;
    },
    resetError: (state) => {
      state.error = null;
      state.loading = false;
      state.userRemoval = false;
      state.deliveredFlag = false;
      state.orderRemoval = false;
    },
    setDeliveredFlag: (state) => {
      state.deliveredFlag = true;
      state.loading = false;
    },
  },
});
export const { setLoading, getUsers, userDelete, setError, resetError, getOrders, setDeliveredFlag, orderDelete } =
  adminSlice.actions;
export default adminSlice.reducer;

export const adminSelector = (state) => state.admin;
