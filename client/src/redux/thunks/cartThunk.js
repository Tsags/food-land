import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const createCart = createAsyncThunk("cart/createCart", async (_, thunkAPI) => {
  const { data } = await axios.post(`/api/carts`);
  return data;
 
});

export default createCart;
