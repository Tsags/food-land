import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: null,
  userList: [],
  userRemoval: false,
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
    userDelete: (state) => {
      state.userRemoval = true;
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
    },
  },
});
export const { setLoading, getUsers, userDelete, setError, resetError } = adminSlice.actions;
export default adminSlice.reducer;

export const adminSelector = (state) => state.admin;
