import express from "express";
import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
import { protectRoute, admin } from "../authenticateMiddleware/authMiddleware.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;
const orderRoutes = express.Router();

// POST /api/orders
// Create a new order for the authenticated user
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, userInfo, _id } = req.body;
  
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const myCustomId = new ObjectId(_id);
    const order = new Order({
      _id: myCustomId,
      orderItems,
      user: userInfo._id,
      username: userInfo.name,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

const getOrders = async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
};

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found.");
  }
});

const setDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const order = await Order.findById(id);
  if (order) {
    order.isDelivered = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order could not be updated.");
  }
});

orderRoutes.route("/").post(protectRoute, createOrder);
orderRoutes.route("/:id").delete(protectRoute, admin, deleteOrder);
orderRoutes.route("/:id").put(protectRoute, admin, setDelivered);
orderRoutes.route("/").get(protectRoute, admin, getOrders);

export default orderRoutes;
