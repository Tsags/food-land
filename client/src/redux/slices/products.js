import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  error: null,
  products: [],
  product: {},
  productUpdate: false,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setProducts: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.products = payload;
    },
    setProduct: (state, { payload }) => {
      state.product = payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    resetError: (state) => {
      state.error = null;
      state.productUpdate = false;
    },
    setProductUpdateFlag: (state) => {
      state.productUpdate = true;
      state.loading = false;
    },
  },
});
export const { setLoading, setProducts, setProduct, setError, resetError, setProductUpdateFlag } =
  productsSlice.actions;
export default productsSlice.reducer;

export const productsSelector = (state) => state.products;
