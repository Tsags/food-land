import express from "express";
import Cart from "../models/Cart.js";
import asyncHandler from "express-async-handler";
import { protectRoute, admin } from "../authenticateMiddleware/authMiddleware.js";

const cartRoutes = express.Router();

const createOrUpdateCart = asyncHandler(async (req, res) => {
  const { itemToAdd } = req.body;
  console.log(itemToAdd);
  if (!itemToAdd) {
    res.status(400);
    throw new Error("No cart items");
  }
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({
      cartItems: itemToAdd,
      user: req.user._id,
      username: req.user.name,
    });
  } else {
    const existingItem = cart.cartItems.find((item) => item.id === itemToAdd.id);
    if (existingItem) {
      existingItem.qty++;
    } else {
      cart.cartItems = [...cart.cartItems, itemToAdd];
    }
  }

  const updatedCart = await cart.save();
  res.status(201).json(updatedCart);
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Find the cart item with the matching product ID
  const cartItem = cart.cartItems.find((item) => item.id === productId);

  if (!cartItem) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  // Update the quantity of the cart item
  cartItem.qty = quantity;

  const updatedCart = await cart.save();
  res.json(updatedCart);
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Find the index of the item with id "default" in the cartItems array
  const defaultItemIndex = cart.cartItems.findIndex((item) => item.id === "default");

  // If the item with id "default" exists, remove it from the cartItems array
  if (defaultItemIndex !== -1) {
    cart.cartItems.splice(defaultItemIndex, 1); // Remove the item at the found index
  }

  const updatedCart = await cart.save();
  res.json(updatedCart);
});

const deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Find the index of the cart item with the matching product ID
  const itemIndex = cart.cartItems.findIndex((item) => item.id.toString() === productId);

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  // Remove the cart item from the cart array
  cart.cartItems.splice(itemIndex, 1);

  const updatedCart = await cart.save();
  res.json(updatedCart);
});

cartRoutes.route("/").get(protectRoute, getCart);
cartRoutes.route("/").put(protectRoute, createOrUpdateCart);
cartRoutes.route("/").delete(protectRoute, deleteCart);
cartRoutes.route("/:productId/quantity").put(protectRoute, updateCartItemQuantity);
cartRoutes.route("/:productId").delete(protectRoute, deleteCartItem);

export default cartRoutes;
