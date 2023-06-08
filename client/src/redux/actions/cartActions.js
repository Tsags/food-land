import axios from "axios";
import {
  setLoading,
  setCart,
  cartItemAdd,
  cartItemRemoval,
  setError,
  clearCart,
  updateQuantity,
} from "../slices/cart.js";

import { io } from "socket.io-client";
const socket = io("/");

export const addCartItem = (id, qty) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const {
    user: { userInfo },
  } = getState();
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };
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
    await axios.put("/api/carts", { itemToAdd }, config);
    socket.emit("cart/add", { item: itemToAdd, userId: userInfo._id });
    console.log(localStorage.getItem("cartItems"));
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

export const removeCartItem = (itemId) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Make the delete request to remove the item from the cart
    await axios.delete(`/api/carts/${itemId}`, config);

    // Dispatch the cartItemRemoval action with the item ID
    dispatch(cartItemRemoval(itemId));
    // socket.emit("cart/remove", { itemId: itemId, userId: userInfo._id });
  } catch (error) {
    dispatch(
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message || "Something unexpected happened!"
      )
    );
  }
};

export const resetCart = (dispatch) => {
  dispatch(clearCart());
};

export const updateCartItemQuantity = (id, qty) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/products/${id}`);
    const itemToAdd = {
      id: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      stock: data.stock,
      qty,
    };
    await axios.put(`/api/carts/${id}/quantity`, { quantity: qty }, config);
    dispatch(updateQuantity(itemToAdd));
    console.log(localStorage.getItem("cartItems"));
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

export const fetchCart = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const {
    user: { userInfo },
  } = getState();
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };
    const itemToAdd = {
      id: "default",
      name: "default",
      image: "default",
      price: 0,
      stock: 0,
      qty: 0,
    };
    await axios.put("/api/carts", { itemToAdd }, config);
    const { data } = await axios.get("/api/carts", config);
    dispatch(setCart(data.cartItems));
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
