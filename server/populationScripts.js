import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import CustomerModel from "./models/Customer.js";
import ProductModel from "./models/Product.js";
import CompletedOrderModel from "./models/completedOrder.js";
import UserModel from "./models/User.js";

const Customer = mongoose.model("Customer", CustomerModel.CustomerSchema);
const Product = mongoose.model("Product", ProductModel.ProductSchema);
const CompletedOrder = mongoose.model("CompletedOrder", CompletedOrderModel.CompletedOrderModelSchema);
const User = mongoose.model("User", UserModel.UserSchema);

//-------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------COMPLETED ORDERS
//-------------------------------------------------------------------------------------------------------------------------------------------

export async function generateCompletedOrders() {
  try {
    // Get all customers and products
    const customers = await Customer.find();
    const products = await Product.find();
    const users = await User.find();
    // Generate a random timestamp
    function getRandomDateWithTime() {
      // Get a random number of days between 1 and 365 (for simplicity, assuming each year has 365 days)
      const randomDays = Math.floor(Math.random() * 365) + 1;

      // Get the current date and time
      const currentDate = new Date();

      // Calculate the random date by adding the random number of days to the current date
      const randomDate = new Date(currentDate.getTime() + randomDays * 24 * 60 * 60 * 1000);

      // Generate a random hour between 8 and 23 (11 PM in 24-hour format)
      const randomHour = Math.floor(Math.random() * (23 - 8 + 1)) + 8;

      // Set the random time to the generated date
      randomDate.setHours(randomHour, 0, 0, 0);

      return randomDate;
    }
    // Example usage:

    // Create completed orders
    const numOrders = 100; // Adjust the number of orders you want to generate
    for (let i = 0; i < numOrders; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const randomCustomer = faker.helpers.arrayElement(customers);
      const orderItems = [];
      const numItems = faker.number.int({ min: 1, max: 6 }); // Random number of items per order
      for (let j = 0; j < numItems; j++) {
        const randomProduct = faker.helpers.arrayElement(products);
        orderItems.push({
          name: randomProduct.name,
          qty: faker.number.int({ min: 1, max: 3 }), // Random quantity per item
          image: randomProduct.image,
          price: randomProduct.price,
          customerId: faker.helpers.arrayElement(randomCustomer.customerId), // Assuming the customer ID is stored in _id field
          id: randomProduct._id, // Assuming the product ID is stored in _id field
        });
      }

      const totalPrice = orderItems.reduce((total, item) => total + item.price * item.qty, 0);

      const randomTimestamp = getRandomDateWithTime();

      await CompletedOrder.create({
        user: randomUser._id,
        username: randomUser.name,
        orderItems,
        totalPrice,
        isDelivered: faker.datatype.boolean(),
        createdAt: randomTimestamp,
        updatedAt: randomTimestamp,
      });
    }

    console.log("Completed orders generated successfully!");
  } catch (error) {
    console.error("Error generating completed orders:", error);
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------CUSTOMERS
//-------------------------------------------------------------------------------------------------------------------------------------------

export async function populateCustomerData() {
  try {
    const products = await Product.find();
    const users = await User.find();
    const customerData = [];
    const numCustomers = 30; // Change this as per your requirement
    const randomUser = faker.helpers.arrayElement(users);
    for (let i = 0; i < numCustomers; i++) {
      const customer = {
        customerId: faker.string.uuid(),
        allergies: faker.helpers.arrayElements(["Fish", "Gluten", "Nuts", "Shellfish", "Dairy"], { min: 0, max: 2 }),
        // allergies: faker.helpers.arrayElements(["Fish", "Gluten", "Nuts", "Shellfish", "Dairy"], {
        //   min: 0,
        //   max: 2,
        // }),
        session: [
          {
            table: faker.helpers.arrayElement(randomUser.name),
            items: faker.helpers.arrayElements(
              products.map((product) => product.name),
              { min: 1, max: 6 }
            ),
            otherCustomers: [
              {
                otherCustomerId: faker.string.uuid(),
                otherCustomerItems: faker.helpers.arrayElements(
                  products.map((product) => product.name),
                  { min: 0, max: 3 }
                ),
              },
            ],
          },
        ],
        isPresent: false,
      };
      customerData.push(customer);
    }

    // Populate the Customer model with generated data
    await Customer.insertMany(customerData);

    console.log("Data successfully populated.");

    // Disconnect from the database
  } catch (error) {
    console.error("Error populating data:", error);
  }
}
