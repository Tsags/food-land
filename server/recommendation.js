import mongoose from "mongoose";
import CustomerModel from "./models/Customer.js";
import ProductModel from "./models/Product.js";

const Customer = mongoose.model("Customer", CustomerModel.CustomerSchema);

export async function retrieveCustomersData() {
  try {
    const customers = await Customer.find().lean();
    return customers;
  } catch (error) {
    console.error("Error retrieving customers data:", error);
    throw error;
  }
}

export async function calculateWeights() {
  try {
    const customers = await retrieveCustomersData();
    const itemWeights = {};

    customers.forEach((customer) => {
      customer.session.forEach((session) => {
        const sessionItems = session.items;
        const sessionLength = sessionItems.length;
        const weightIncrement = 1 / sessionLength; // Divide weight equally among items in the session

        sessionItems.forEach((item) => {
          if (!itemWeights[item]) {
            itemWeights[item] = 0;
          }
          itemWeights[item] += weightIncrement;
        });
      });
    });

    return itemWeights;
  } catch (error) {
    console.error("Error calculating weights:", error);
    throw error;
  }
}
