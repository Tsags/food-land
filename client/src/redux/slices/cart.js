import { createSlice } from "@reduxjs/toolkit";

const calculateTotal = (cartState) => {
  let result = 0;
  cartState.map((item) => (result += item.qty * item.price));
  return Number(result).toFixed(2);
};

export const initialState = {
  loading: false,
  error: null,
  cart: JSON.parse(localStorage.getItem("cartItems")) || [],
  total: localStorage.getItem("cartItems") ? calculateTotal(JSON.parse(localStorage.getItem("cartItems"))) : 0,
};

const updateLocalStorage = (cart) => {
  localStorage.setItem("cartItems", JSON.stringify(cart));
  localStorage.setItem("total", JSON.stringify(calculateTotal(cart)));
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setCart: (state, { payload }) => {
      state.cart = payload;
      updateLocalStorage(state.cart);
      state.total = calculateTotal(state.cart);
      state.loading = false;
      state.error = null;
    },
    cartItemAdd: (state, { payload }) => {
      const existingItem = state.cart.find((item) => item.id === payload.id);
      if (existingItem) {
        existingItem.qty++;
      } else {
        state.cart = [...state.cart, payload];
      }
      state.loading = false;
      state.error = null;
      updateLocalStorage(state.cart);
      state.total = calculateTotal(state.cart);
    },
    updateQuantity: (state, { payload }) => {
      const existingItem = state.cart.find((item) => item.id === payload.id);
      if (existingItem) {
        existingItem.qty = payload.qty;
      }
      state.loading = false;
      state.error = null;
      updateLocalStorage(state.cart);
      state.total = calculateTotal(state.cart);
    },
    cartItemRemoval: (state, { payload }) => {
      state.cart = [...state.cart].filter((item) => item.id !== payload);
      updateLocalStorage(state.cart);
      state.total = calculateTotal(state.cart);
      state.loading = false;
      state.error = null;
    },
    clearCart: (state) => {
      localStorage.removeItem("cartItems");
      state.cart = [];
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
  },
});
export const { setLoading, setCart, cartItemAdd, cartItemRemoval, updateQuantity, clearCart, setError } =
  cartSlice.actions;
export default cartSlice.reducer;

export const cartSelector = (state) => state.cart;
