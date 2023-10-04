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

const findCustomerByLastSessionTable = async (req, res) => {
  const { tableName } = req.params;

  const pipeline = [
    { $match: { isPresent: true } },
    { $unwind: "$session" },
    { $sort: { "session.createdAt": -1 } },
    {
      $group: {
        _id: "$_id",
        customerId: { $first: "$customerId" },
        lastSession: { $first: "$session" },
      },
    },
    { $match: { "lastSession.table": tableName } },
  ];

  const customers = await Customer.aggregate(pipeline).exec();
  res.json(customers);
};

const findCustomer = async (req, res) => {
  const { customerId } = req.params;
  console.log(customerId);
  const customer = await Customer.find({ customerId: customerId });
  res.json(customer);
};

const saveRating = asyncHandler(async (req, res) => {
  try {
    const { rating, customerId, productName } = req.body;
    console.log(rating);
    console.log(productName);
    // Retrieve the customer
    const customers = await Customer.find({ customerId: customerId });

    if (!customers || customers.length === 0) {
      return res.status(404).send("Customer not found");
    }

    const customer = customers[0]; // Get the first customer from the array

    const items = customer.session[customer.session.length - 1]?.items;

    for (let item of items) {
      if (item.name === productName) {
        item.rating = rating;
      }
    }

    await customer.save();

    res.status(200).send("Rating updated successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// customerRoutes.route("/:tableName").get(findCustomerByLastSessionTable);
customerRoutes.route("/:customerId").get(findCustomer);
customerRoutes.route("/").post(saveRating);
customerRoutes.route("/").put(createOrUpdateAllergies);

export default customerRoutes;
