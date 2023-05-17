import { combineReducers, configureStore } from "@reduxjs/toolkit";
import products from "./slices/products.js";
import cart from "./slices/cart.js";
import user from "./slices/user.js";

const reducer = combineReducers({
  products,
  cart,
  user,
});

export default configureStore({
  reducer,
});
