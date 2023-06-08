import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setCart } from "../redux/slices/cart";

const socket = io("/");

const Socket = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.userInfo?._id);
  console.log(currentUserId);
  useEffect(() => {
    socket.on("cart/update", ({ cart, userId }) => {
      if (userId === currentUserId) {
        dispatch(setCart(cart));
      }
    });

    return () => {
      socket.off("cart/update");
    };
  }, [dispatch, currentUserId]);
};

export default Socket;
