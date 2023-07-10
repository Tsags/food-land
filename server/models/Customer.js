import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    allergies: {
      type: [String],
      default: [],
    },
    session: [
      {
        table: {
          type: String,
          required: true,
          default: "",
        },
        items: {
          type: [String],
          required: true,
          default: [],
        },
        otherCustomers: [
          {
            otherCustomerId: {
              type: String,
            },
            otherCustomerItems: {
              type: [String],
              required: true,
              default: [],
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPresent: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
