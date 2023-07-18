import dotenv from "dotenv";
import connectToDatabase from "./database.js";
import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

// Routes.
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import completedOrderRoutes from "./routes/completedOrderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

import { hybridFiltering } from "./recommendation.js";

dotenv.config();
connectToDatabase();
const app = express();
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/completedOrders", completedOrderRoutes);
app.use("/api/customers", customerRoutes);

app.get("/api/data", (req, res) => {
  const targetCustomerId = req.cookies.customerId;
  hybridFiltering(targetCustomerId);
});

const expressServer = app.listen(port, () => {
  console.log(`Server runs on port ${port}.`);
});
const io = new Server(expressServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let carts = {};
let orders = [];

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("cart/addItem", ({ item, userId, customerId }) => {
    if (!carts[userId]) {
      carts[userId] = [];
    }
    const cart = carts[userId];
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      existingItem.qty += item.qty;
    } else {
      cart.push(item);
    }
    io.emit("cart/update", { cart, userId, customerId });
  });

  socket.on("cart/removeItem", ({ itemId, userId }) => {
    const cart = carts[userId];
    if (cart) {
      const updatedCart = cart.filter((item) => item.id !== itemId);
      carts[userId] = updatedCart;
      io.emit("cart/update", { cart: updatedCart, userId });
    }
  });

  socket.on("cart/updateQty", ({ itemId, quantity, userId }) => {
    const cart = carts[userId];
    if (cart) {
      const updatedCart = cart.map((item) => {
        if (item.id === itemId) {
          return { ...item, qty: quantity };
        }
        return item;
      });
      carts[userId] = updatedCart;
      io.emit("cart/update", { cart: updatedCart, userId });
    }
  });

  socket.on("cart/removeCart", (userId) => {
    if (carts[userId]) {
      carts[userId] = [];
      io.emit("cart/update", { cart: [], userId });
    }
  });

  socket.on("order/create", (order) => {
    io.emit("order/update", order);
  });
  socket.on("request", ({ request, userInfo }) => {
    io.emit("admin-notification", { request, userInfo });
  });
  socket.on("user/connected", (name) => {
    io.emit("user/update", { name: name });
  });
});
