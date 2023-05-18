import express from "express";
import Cart from "../models/Cart.js";
import asyncHandler from "express-async-handler";
import protectRoute from "../authenticateMiddleware/authMiddleware.js";
import User from "../models/User.js";

const cartRoutes = express.Router();

// POST /api/carts
// Create a new cart for the authenticated user
const createCart = asyncHandler(async (req, res) => {
  const user = await User.findOne({ user: req.user._id });
  const existingCart = await Cart.findOne({ name: user.name });
  if (existingCart) {
    res.status(200).json(existingCart);
  } else {
    const cart = await Cart.create({
      name: user.name,
      items: [],
    });
    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  }
});

// GET /api/carts/:id
// Get the cart for the authenticated user by cart ID
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findOne({ user: req.user._id });
  const cart = await Cart.findOne({ name: user.name });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }
  res.json(cart);
});

// PUT /api/carts/:id
// Update the cart for the authenticated user by cart ID
const updateCart = asyncHandler(async (req, res) => {
  const user = await User.findOne({ user: req.user._id });
  const cart = await Cart.findOne({ name: user.name });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }
  cart.items = req.body.items;
  const savedCart = await cart.save();
  res.json(savedCart);
});

// DELETE /api/carts/:id
// Delete the cart for the authenticated user by cart ID
const deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ _id: req.params.id, user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }
  await cart.remove();
  res.json({ message: "Cart removed" });
});

cartRoutes.route("/").post(protectRoute, createCart);
cartRoutes.route("/:id").get(protectRoute, getCart).put(protectRoute, updateCart).delete(protectRoute, deleteCart);

export default cartRoutes;
