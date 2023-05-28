import { createSlice } from "@reduxjs/toolkit";

const calculateTotal = (cartState) => {
  let result = 0;
  cartState.map((item) => (result += item.qty * item.price));
  return Number(result).toFixed(2);
};

export const initialState = {
  loading: false,
  error: null,
  cartId: "",
  cart: JSON.parse(sessionStorage.getItem("cartItems")) || [],
  total: sessionStorage.getItem("cartItems") ? calculateTotal(JSON.parse(sessionStorage.getItem("cartItems"))) : 0,
};

const updateSessionStorage = (cart, cartId) => {
  sessionStorage.setItem("cartItems", JSON.stringify(cart));
  sessionStorage.setItem("cartId", JSON.stringify(cartId));
  sessionStorage.setItem("total", JSON.stringify(calculateTotal(cart)));
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setCart: (state, { payload }) => {
      state.cartId = payload._id;
      state.cart = payload.items;
      state.total = calculateTotal(payload.items);
      state.loading = false;
      state.error = null;
      updateSessionStorage(state.cart, state.cartId);
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
      updateSessionStorage(state.cart);
      state.total = calculateTotal(state.cart);
    },
    cartItemRemoval: (state, { payload }) => {
      state.cart = [...state.cart].filter((item) => item.id !== payload);
      updateSessionStorage(state.cart);
      state.total = calculateTotal(state.cart);
      state.loading = false;
      state.error = null;
    },
    clearCart: (state) => {
      sessionStorage.removeItem("cartItems");
      state.cart = [];
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
  },
});
export const { setLoading, setCart, cartItemAdd, cartItemRemoval, clearCart, setError } = cartSlice.actions;
export default cartSlice.reducer;

export const cartSelector = (state) => state.cart;
