import axios from "axios";
import { setLoading, clearOrder, setError, orderCreate } from "../slices/order";
import { clearCart } from "../slices/cart";

export const createOrder = (order) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  console.log(order.orderItems);
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
    dispatch(orderCreate(order.orderItems));
    await axios.post("/api/orders", order, config);
    await axios.delete("/api/carts", config);
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

export const resetOrder = () => async (dispatch) => {
  dispatch(clearOrder());
};
