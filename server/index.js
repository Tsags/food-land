import dotenv from "dotenv";
import connectToDatabase from "./database.js";
import express from "express";
import { Server } from "socket.io";
// Routes.
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectToDatabase();
const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);

const expressServer = app.listen(port, () => {
  console.log(`Server runs on port ${port}.`);
});
const io = new Server(expressServer, {
  pingTimeout: 5000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let carts = {};

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("cart/addItem", ({ item, userId }) => {
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
    io.emit("cart/update", { cart, userId });
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
});
