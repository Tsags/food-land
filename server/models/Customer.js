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
              required: true,
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
    newSessionFlag: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

customerSchema.methods.addItemsToSession = function (table, items) {
  if (!this.newSessionFlag) {
    // Add items to the current session
    const currentSession = this.session[this.session.length - 1];
    currentSession.table = table;
    currentSession.items.push(...items);
  } else {
    // Add a new session with the provided items
    const newSession = {
      table,
      items,
      otherCustomers: {
        otherCustomersId: [],
        otherCustomersItems: [],
      },
    };
    this.session.push(newSession);
    // this.newSessionFlag = false; // Set newSessionFlag flag to false for the new session
  }
};

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
