import axios from "axios";
import { setLoading, clearOrder, setError } from "../slices/order";

export const createOrder = (order) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const {
    user: { userInfo },
    order: { orderInfo },
  } = getState();

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/orders", order, config);
    console.log(data);
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
