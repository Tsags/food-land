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
    const customers = await Customer.find();
    const products = await Product.find();
    const users = await User.find();
    function getRandomDateWithTime() {
      const randomDays = Math.floor(Math.random() * 365) + 1;
      const currentDate = new Date();
      const randomDate = new Date(currentDate.getTime() + randomDays * 24 * 60 * 60 * 1000);
      const randomHour = Math.floor(Math.random() * (23 - 8 + 1)) + 8;
      randomDate.setHours(randomHour, 0, 0, 0);

      return randomDate;
    }

    // Create completed orders
    const numOrders = 60;
    for (let i = 0; i < numOrders; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const randomCustomer = faker.helpers.arrayElement(customers);
      const customerId = [randomCustomer.customerId];
      const orderItems = [];
      const numItems = faker.number.int({ min: 1, max: 6 });
      for (let j = 0; j < numItems; j++) {
        const randomProduct = faker.helpers.arrayElement(products);
        orderItems.push({
          name: randomProduct.name,
          qty: faker.number.int({ min: 1, max: 3 }),
          image: randomProduct.image,
          price: randomProduct.price,
          customerId: customerId,
          id: randomProduct._id,
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
    const numCustomers = 40; // Change this as per your requirement
    const randomUser = faker.helpers.arrayElement(users);
    for (let i = 0; i < numCustomers; i++) {
      const customer = {
        customerId: faker.string.uuid(),
        allergies: faker.helpers.arrayElements(["Fish", "Gluten", "Nuts", "Shellfish", "Dairy"], { min: 0, max: 2 }),
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
