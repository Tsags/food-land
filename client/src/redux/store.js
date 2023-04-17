import { combineReducers, configureStore } from "@reduxjs/toolkit";
import products from "./slices/products.js";

const reducer = combineReducers({
  products,
});

export default configureStore({
  reducer,
});
