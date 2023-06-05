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
  dispatch(cartItemRemoval(itemId));
};

export const resetCart = (dispatch) => {
  dispatch(clearCart());
};

export const updateCartItemQuantity = (id, qty) => async (dispatch, getState) => {
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
    dispatch(updateQuantity(itemToAdd));

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
