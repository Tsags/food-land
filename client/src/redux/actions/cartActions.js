import axios from "axios";
import { setLoading, setCart, cartItemAdd, cartItemRemoval, setError, clearCart } from "../slices/cart.js";

// export const fetchCart = () => async (dispatch, getState) => {
//   const { userInfo } = getState().user;
//   console.log(userInfo.token);
//   dispatch(setLoading(true));
//   console.log(1);
//   try {
//     const response = await axios.get(`/api/carts/${userInfo._id}`, {
//       headers: {
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     });

//     const cart = response.data;
//     dispatch(setCart(cart));
//   } catch (error) {
//     dispatch(
//       setError(
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message
//           ? error.message
//           : "Something unexpected happened!!"
//       )
//     );
//   }
// };

export const addCartItem = (id, qty) => async (dispatch, getState) => {
  // const { userInfo } = getState().user;
  // console.log(userInfo.token);
  dispatch(setLoading(true));
  try {
    // const cart = getState();
    // const { cartId } = cart;
    // console.log(cartId);
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
    // const response = await axios.put(
    //   `/api/carts/${cartId}`,
    //   { items: [itemToAdd] },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${userInfo.token}`,
    //     },
    //   }
    // );
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
  // const { userInfo } = getState().user;
  // console.log(userInfo.token);
  dispatch(setLoading(true));
  dispatch(cartItemRemoval(itemId));
  // try {
  //   const response = await axios.delete(`/api/carts/${itemId}`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${userInfo.token}`,
  //     },
  //   });

  //   if (response.status !== 200) {
  //     throw new Error("Item removal failed");
  //   }

  //   const updatedCart = response.data;
  //   console.log(updatedCart);
  // } catch (error) {
  //   dispatch(
  //     setError(
  //       error.response && error.response.data.message
  //         ? error.response.data.message
  //         : error.message
  //         ? error.message
  //         : "Something unexpected happened!!"
  //     )
  //   );
  // }
};

export const resetCart = (dispatch) => {
  dispatch(clearCart());
};
