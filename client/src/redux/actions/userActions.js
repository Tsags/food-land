import axios from "axios";
import { setLoading, setError, userLogin, userLogout, setUserOrders } from "../slices/user";
import { io } from "socket.io-client";
const socket = io("/");

export const login = (name, password) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post("/api/users/login", { name, password }, config);

    const customerId = data.customerId;
    console.log(customerId);
    dispatch(userLogin(data));
    localStorage.removeItem("cartItems");
    localStorage.removeItem("orders");
    localStorage.removeItem("allergies");
    localStorage.removeItem("customerInfo");
    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("customerInfo", JSON.stringify(customerId));
    socket.emit("user/connected", name);
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

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch(userLogout());
};

export const register = (name, password, qrCodeData) => async (dispatch) => {
  dispatch(setLoading(true));
  console.log(qrCodeData);
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post("/api/users/register", { name, password, qrCodeData }, config);
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

export const getUserOrders = () => async (dispatch, getState) => {
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

    const { data } = await axios.get(`/api/users/${userInfo._id}`, config);
    dispatch(setUserOrders(data));
  } catch (error) {
    dispatch(
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message || "An unexpected error has occurred. Please try again later."
      )
    );
  }
};
