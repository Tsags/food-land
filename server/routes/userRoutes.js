import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { protectRoute, admin } from "../authenticateMiddleware/authMiddleware.js";

const userRoutes = express.Router();

//TODO: redefine expiresIn
const genToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "60d" });
};

const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });

  if (user && (await user.matchPasswords(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      token: genToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid something.");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, password, qrCodeData } = req.body;

  const userExists = await User.findOne({ name });
  if (userExists) {
    res.status(400);
    throw new Error("Already registered.");
  }

  const user = await User.create({
    name,
    password,
    qrCodeData,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
      token: genToken(user._id),
    });
  } else {
    res.json(400);
    throw new Error("Invalid user data.");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(401);
    throw new Error("This user could not be found");
  }
});

const fetchAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id });
  if (orders) {
    res.json(orders);
  } else {
    res.status(404).json({ message: "No Orders found" });
  }
});

userRoutes.route("/").get(protectRoute, admin, fetchAllUsers);
userRoutes.route("/:id").delete(protectRoute, admin, deleteUser);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/register").post(registerUser);
userRoutes.route("/:id").get(protectRoute, getUserOrders);

export default userRoutes;
