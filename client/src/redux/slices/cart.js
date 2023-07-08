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
  console.log(JSON.parse(localStorage.getItem("cartItems")));
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
      // setCart: (state, { payload }) => {
      //   const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
      //   const storedCustomerId = storedCartItems ? storedCartItems.customerId : [];
      //   const payloadCustomerId = payload && payload.customerId ? payload.customerId : [];

      //   const maxCustomerId = storedCustomerId.length > payloadCustomerId.length ? storedCustomerId : payloadCustomerId;

      //   state.cart = payload;
      //   if (state.cart) {
      //     state.cart.customerId = maxCustomerId;
      //     updateLocalStorage(state.cart);
      //     state.total = calculateTotal(state.cart);
      //     state.loading = false;
      //     state.error = null;
      //   }
      // }
    },
    cartItemAdd: (state, action) => {
      const payload = action.payload;
      const existingItem = state.cart.find((item) => item.id === payload.id);
      console.log(payload.customerId);
      if (existingItem) {
        existingItem.qty++;
        const customerId = JSON.parse(localStorage.getItem("customerId"));
        if (!existingItem.customerId.includes(customerId)) {
          existingItem.customerId = [...existingItem.customerId, customerId];
        }
      } else {
        state.cart = [...state.cart, payload];
      }
      updateLocalStorage(state.cart);
      state.total = calculateTotal(state.cart);
      console.log(JSON.parse(localStorage.getItem("cartItems")));
      state.loading = false;
      state.error = null;
    },

    updateQuantity: (state, action) => {
      const payload = action.payload;
      const existingItem = state.cart.find((item) => item.id === payload.id);
      if (existingItem) {
        existingItem.qty = payload.qty;
      }
      state.loading = false;
      state.error = null;
      updateLocalStorage(state.cart);
      state.total = calculateTotal(state.cart);
    },
    cartItemRemoval: (state, action) => {
      const payload = action.payload;
      state.cart = [...state.cart].filter((item) => item.id !== payload);
      updateLocalStorage(state.cart);
      state.total = calculateTotal(state.cart);
      state.loading = false;
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = [];
      state.total = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("total");
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
