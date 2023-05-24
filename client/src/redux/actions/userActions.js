import axios from "axios";
import { setLoading, setError, userLogin, userLogout } from "../slices/user";

export const login = (name, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post("/api/users/login", { name, password }, config);
    sessionStorage.setItem("userInfo", JSON.stringify(data));
    dispatch(userLogin(data));
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
  sessionStorage.removeItem("userInfo");
  dispatch(userLogout());
};

export const register = (name, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post("/api/users/register", { name, password }, config);
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
