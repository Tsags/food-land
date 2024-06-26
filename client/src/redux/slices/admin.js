import { createSlice } from "@reduxjs/toolkit";

const storedOrders = localStorage.getItem("orders");
const initialOrders = storedOrders ? JSON.parse(storedOrders) : [];

const storedCompletedOrders = localStorage.getItem("completedOrders");
const initialCompletedOrders = storedCompletedOrders ? JSON.parse(storedCompletedOrders) : [];

export const initialState = {
  error: null,
  userList: [],
  requests: [],
  userRemoval: false,
  orders: initialOrders,
  orderRemoval: false,
  deliveredFlag: false,
  notifications: [],
  completedOrders: initialCompletedOrders,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },
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
      localStorage.setItem("orders", JSON.stringify(payload));
    },
    orderUpdate: (state, { payload }) => {
      state.orders.push(payload);
      const newNotification = { ...payload, read: false };
      state.notifications.push(newNotification);
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
    userDelete: (state) => {
      state.userRemoval = true;
      state.loading = false;
      state.error = null;
    },
    orderDelete: (state, { payload }) => {
      state.orders = state.orders.filter((order) => order._id !== payload._id);
      state.orderRemoval = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("orders", JSON.stringify(state.orders));
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
    setRequests: (state, { payload }) => {
      state.requests.push(payload);
      const newNotification = { ...payload, read: false };
      state.notifications.push(newNotification);
      state.error = null;
      state.loading = false;
    },
    setNotifications: (state, { payload }) => {
      const newNotification = { ...payload, read: false };
      state.notifications.push(newNotification);

      state.error = null;
      state.loading = false;
    },
    deleteNotification: (state, action) => {
      const index = action.payload;
      state.notifications.splice(index, 1);
    },
    setDeliveredFlag: (state, { payload }) => {
      const orderToUpdate = state.orders.find((order) => order._id === payload);
      if (orderToUpdate) {
        orderToUpdate.isDelivered = true;
      }
      state.deliveredFlag = true;
      state.loading = false;
    },
    itemDeliveredFlag: (state, { payload }) => {
      const { orderId, itemId } = payload;
      const order = state.orders.find((order) => order.orderId === orderId);
      if (order) {
        const itemToUpdate = order.orderItems.find((item) => item.id === itemId);
        if (itemToUpdate) {
          itemToUpdate.isDelivered = true;
        }
        localStorage.setItem("orders", JSON.stringify(state.orders));
      }
      state.loading = false;
    },
    orderSetCompleted: (state, { payload }) => {
      state.orders = state.orders.filter((order) => order._id !== payload);

      state.orderSetCompleted = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
    getCompletedOrders: (state, { payload }) => {
      state.completedOrders = payload;

      localStorage.setItem("completedOrders", JSON.stringify(payload));
      state.loading = false;
      state.error = null;
    },
  },
});
export const {
  setLoading,
  getUsers,
  userDelete,
  orderUpdate,
  setError,
  resetError,
  getOrders,
  setDeliveredFlag,
  orderDelete,
  setRequests,
  deleteNotification,
  markAllAsRead,
  setNotifications,
  itemDeliveredFlag,
  orderSetCompleted,
  getCompletedOrders,
} = adminSlice.actions;
export default adminSlice.reducer;

export const adminSelector = (state) => state.admin;
