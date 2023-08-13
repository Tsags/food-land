import express from "express";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import CompletedOrder from "../models/completedOrder.js";
import asyncHandler from "express-async-handler";
import { protectRoute, admin } from "../authenticateMiddleware/authMiddleware.js";
import mongoose from "mongoose";

const completedOrderRoutes = express.Router();

const moveOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the order in the Order schema
  const order = await Order.findById(id);
  const customerIds = [];
  if (order) {
    // Move the order to the CompletedOrder schema
    const completedOrder = new CompletedOrder(order.toObject());
    await completedOrder.save();

    const items = order.orderItems;
    const customers = await Customer.find({});

    for (const item of items) {
      for (const customer of customers) {
        const customerItems = customer.session[customer.session.length - 1].items;
        for (const id of item.customerId) {
          if (!customerIds.includes(id)) {
            customerIds.push(id);
          }
        }
        if (item.customerId.includes(customer.customerId) && !customerItems.some((e) => e.name === item.name)) {
          customerItems.push({ name: item.name, rating: 0 }); // Assuming 0 as default rating

          customer.isPresent = false;
          for (let i = 0; i < customer.session[customer.session.length - 1].otherCustomers.length; i++) {
            const associatedCustomersId =
              customer.session[customer.session.length - 1].otherCustomers[i].otherCustomerId;
            await Customer.updateOne({ customerId: associatedCustomersId }, { $set: { isPresent: false } });
          }
        }

        const otherCustomers = customer.session[customer.session.length - 1].otherCustomers;

        for (const otherCustomer of otherCustomers) {
          if (
            item.customerId.includes(otherCustomer.otherCustomerId) &&
            !otherCustomer.otherCustomerItems.some((e) => e.name === item.name)
          ) {
            otherCustomer.otherCustomerItems.push(item.name); // Assuming 0 as default rating
          }
        }

        await customer.save();
      }
    }

    // Delete the order from the Order schema
    await Order.findByIdAndDelete(id);
    res.json({ customerIds: customerIds });
  } else {
    res.status(404);
    throw new Error("Order not found.");
  }
});

const getOrders = async (req, res) => {
  const orders = await CompletedOrder.find({});

  res.json(orders);
};

completedOrderRoutes.route("/:id").put(moveOrder);
completedOrderRoutes.route("/").get(getOrders);

export default completedOrderRoutes;
