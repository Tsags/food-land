import mongoose from "mongoose";
import User from "./User.js";

const cartItemSchema = new mongoose.Schema(
  {
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
    qty: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: { type: [cartItemSchema], default: [] },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  const cart = this;
  let totalPrice = 0;
  cart.items.forEach((item) => {
    totalPrice += item.qty * item.price;
  });
  cart.totalPrice = totalPrice;
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
