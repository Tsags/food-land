import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { protectRoute, admin } from "../authenticateMiddleware/authMiddleware.js";
import pkg from "crypto-js";
const { SHA256, enc } = pkg;

const userRoutes = express.Router();

//TODO: redefine expiresIn
const genToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "60d" });
};

function generateHash(data) {
  const hash = SHA256(data);
  return hash.toString(enc.Hex);
}

const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });

  if (user && (await user.matchPasswords(password))) {
    let customerIdFromCookie = req.cookies ? req.cookies.customerId : undefined;
    console.log(customerIdFromCookie);

    let customer = await Customer.findOne({ customerId: customerIdFromCookie });

    if (!customerIdFromCookie) {
      const fingerprint =
        req.headers["user-agent"] +
        req.headers["accept-language"] +
        req.headers["accept-encoding"] +
        req.headers["accept"] +
        req.headers["connection"];
      const customerId = generateHash(fingerprint);

      res.cookie("customerId", customerId, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      });

      // Create a new customer entry
      customer = await Customer.create({ customerId: customerId, session: [{ table: name }] });
      customerIdFromCookie = customerId; // Update the customerIdFromCookie variable
    } else {
      if (!customer || !customer.session) {
        customer = await Customer.findOneAndUpdate(
          { customerId: customerIdFromCookie },
          { $setOnInsert: { session: [{ table: name }] } },
          { new: true, upsert: true }
        );
      } else {
        // Check if the desired session exists
        // const sessionExists = customer.session.some((s) => s.table === name);
        const latestSession = customer.session[customer.session.length - 1];

        const sessionExists =
          customer.session.length > 0 &&
          latestSession &&
          latestSession.table === name &&
          Date.now() - latestSession.createdAt.getTime() <= 6 * 60 * 60 * 1000; // 6 ωρες
        // console.log(Date.now() - latestSession.createdAt.getTime());
        if (!sessionExists) {
          // Create a new session object in the session array
          customer.session.push({ table: name, items: [], otherCustomers: [] });
          customer.isPresent = true;
          await customer.save();
        }
      }
    }

    // Set the customerId cookie in the response

    const otherCustomers = await Customer.find({
      customerId: { $ne: customerIdFromCookie },
      "session.table": { $eq: name },
      isPresent: true,
    });

    for (const otherCustomer of otherCustomers) {
      const otherCustomerId = otherCustomer.customerId.toString(); // Ensure it's a string

      const existingCustomer = customer.session.find((s) => s.table === name);
      if (
        existingCustomer &&
        !existingCustomer.otherCustomers.some((item) => item.otherCustomerId === otherCustomerId)
      ) {
        existingCustomer.otherCustomers.push({ otherCustomerId: otherCustomerId });
        await customer.save();
      }

      const session = otherCustomer.session.find((s) => s.table === name);
      if (session && !session.otherCustomers.some((item) => item.otherCustomerId === customerIdFromCookie)) {
        session.otherCustomers.push({ otherCustomerId: customerIdFromCookie });
        await otherCustomer.save();
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      token: genToken(user._id),
      customerId: customerIdFromCookie,
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
