import express from "express";
import Customer from "../models/Customer.js";
import asyncHandler from "express-async-handler";
import { protectRoute, admin } from "../authenticateMiddleware/authMiddleware.js";

const customerRoutes = express.Router();

const createOrUpdateAllergies = asyncHandler(async (req, res) => {
  const allergies = req.body;
  const customerIdFromCookie = req.cookies.customerId;

  await Customer.updateOne({ customerId: customerIdFromCookie }, { $set: { allergies: allergies } });
  res.sendStatus(200);
});

customerRoutes.route("/").put(createOrUpdateAllergies);

export default customerRoutes;
