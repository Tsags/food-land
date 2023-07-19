import axios from "axios";
import { setLoading, clearOrder, setError, orderCreate } from "../slices/order";
import randomstring from "randomstring";
import { io } from "socket.io-client";
const socket = io("/");

export const createOrder = (order) => async (dispatch, getState) => {
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
    dispatch(orderCreate(order.orderItems));
    const orderId = randomstring.generate({
      length: 24,
      charset: "hex",
    });
    const currentDate = new Date();

    const updatedOrder = { ...order, _id: orderId, createdAt: currentDate };

    await axios.post("/api/orders", updatedOrder, config);
    socket.emit("order/create", updatedOrder);
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
