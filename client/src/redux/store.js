import { combineReducers, configureStore } from "@reduxjs/toolkit";
import products from "./slices/products.js";
import cart from "./slices/cart.js";

const reducer = combineReducers({
  products,
  cart,
});

export default configureStore({
  reducer,
});
