import axios from "axios";
// import createCart from "../thunks/cartThunk.js";
import { setLoading, setError, cartItemAdd, cartItemRemoval } from "../slices/cart.js";
import {useState} from "react"



export const addCartItem = (id, qty) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { data } = await axios.get(`/api/products/${id}`);
    const itemToAdd = {
      id: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      stock: data.stock,
      qty,
    };
 
    dispatch(cartItemAdd(itemToAdd));
    return itemToAdd;
  } catch (error) {
    dispatch(
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "Something unexpected happened!!"
      )
    );
  }
};

export const removeCartItem = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(cartItemRemoval(id));
};
