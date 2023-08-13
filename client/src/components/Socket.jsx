import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../redux/slices/cart";
import { orderUpdate, setRequests, setNotifications } from "../redux/slices/admin";
import { useSocket } from "./useSocket"; // Προσθήκη αυτής της γραμμής
import { useNavigate } from "react-router-dom";

const Socket = () => {
  const navigate = useNavigate();
  const socket = useSocket(); // Καλέστε το custom hook εδώ
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.userInfo?._id);
  const currentCustomerId = JSON.parse(localStorage.getItem("customerId"));

  useEffect(() => {
    socket.on("cart/update", ({ cart, userId, customerId }) => {
      if (userId === currentUserId && customerId !== currentCustomerId) {
        dispatch(setCart(cart));
      }
    });

    return () => {
      socket.off("cart/update");
    };
  }, [dispatch, currentUserId, currentCustomerId, socket]);

  useEffect(() => {
    socket.on("order/update", (order) => {
      dispatch(orderUpdate(order));
    });

    return () => {
      socket.off("order/update");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("admin-notification", ({ request, userInfo }) => {
      dispatch(setRequests({ request, userInfo }));
    });

    return () => {
      socket.off("admin-notification");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("user/update", (name) => {
      dispatch(setNotifications(name));
    });

    return () => {
      socket.off("user/update");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    // Associate the user ID or session ID with the socket connection
    socket.emit("user/connect", { userId: currentUserId });
  }, [currentUserId, socket]);

  useEffect(() => {
    socket.on("redirectUser", (customers) => {
      console.log(customers);
      if (customers.customerIds.includes(currentCustomerId)) {
        navigate("/reviews");
      }
    });

    return () => {
      socket.off("redirectUser");
    };
  }, [dispatch, socket, currentCustomerId, navigate]);
};

export default Socket;
