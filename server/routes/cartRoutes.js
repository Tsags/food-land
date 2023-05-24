import express from "express";
import Cart from "../models/Cart.js";
import asyncHandler from "express-async-handler";
import protectRoute from "../authenticateMiddleware/authMiddleware.js";
import User from "../models/User.js";

const cartRoutes = express.Router();

// POST /api/carts
// Create a new cart for the authenticated user
const createCart = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  console.log(user);
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
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
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
  const user = await User.findOne({ _id: req.user._id });
  const cart = await Cart.findOne({ name: user.name });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }
  const itemsToAdd = req.body.items;
  // Loop through the items to be added
  for (const itemToAdd of itemsToAdd) {
    const existingItem = cart.items.find((item) => item.name === itemToAdd.name && item.id.toString() === itemToAdd.id);
    if (existingItem) {
      // Item already exists, update the qty field
      existingItem.qty += itemToAdd.qty; // Add the qty of the new item to the existing item's qty
    } else {
      // Item doesn't exist, add it to the items array
      cart.items.push(itemToAdd);
    }
  }
  const savedCart = await cart.save();
  res.json(savedCart);
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const cart = await Cart.findOne({ name: user.name });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }
  const itemId = req.params.id;
  console.log("itemId:", itemId);
  console.log("cart.items:", cart.items);
  const itemIndex = cart.items.findIndex((item) => item.id.toString() === itemId);
  console.log("itemIndex:", itemIndex);
  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Item not found in cart");
  }
  // Remove the item from the items array
  cart.items.splice(itemIndex, 1);
  const savedCart = await cart.save();
  res.json(savedCart);
});

// DELETE /api/carts/:id
// Delete the cart for the authenticated user by cart ID
// const deleteCart = asyncHandler(async (req, res) => {
//   const cart = await Cart.findOne({ _id: req.params.id, user: req.user._id });
//   if (!cart) {
//     res.status(404);
//     throw new Error("Cart not found");
//   }
//   await cart.remove();
//   res.json({ message: "Cart removed" });
// });

cartRoutes.route("/").post(protectRoute, createCart);
cartRoutes
  .route("/:id")
  .get(protectRoute, getCart)
  .put(protectRoute, updateCart)
  .delete(protectRoute, removeItemFromCart);

export default cartRoutes;
