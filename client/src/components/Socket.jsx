import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setCart } from "../redux/slices/cart";
import { orderUpdate } from "../redux/slices/admin";

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

  useEffect(() => {
    socket.on("order/update", (order) => {
      console.log("order in socket:", order);
      dispatch(orderUpdate(order));
    });

    return () => {
      socket.off("order/update");
    };
  }, [dispatch]);

  useEffect(() => {
    // Associate the user ID or session ID with the socket connection
    socket.emit("user/connect", { userId: currentUserId });
  }, [currentUserId]);
};

export default Socket;
