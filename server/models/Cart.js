import mongoose from "mongoose";
import User from "./User.js";

const cartItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    qty: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: { type: [cartItemSchema], default: [], required: true },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  const cart = this;
  let totalPrice = 0;
  if (!cart.items || cart.items.length === 0) {
    // Add a check for undefined or empty array
    totalPrice = 0;
  } else {
    cart.items.forEach((item) => {
      totalPrice += item.qty * item.price;
    });
  }

  cart.totalPrice = totalPrice;
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
