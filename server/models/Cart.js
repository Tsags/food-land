import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
      ref: "User",
    },
    cartItems: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0.0,
    },
  },
  { timestamps: true }
);

// Calculate the totalPrice based on the cartItems
cartSchema.pre("save", function (next) {
  const cart = this;
  let totalPrice = 0.0;

  if (cart.cartItems && cart.cartItems.length > 0) {
    totalPrice = cart.cartItems.reduce((accumulator, item) => {
      return accumulator + item.qty * item.price;
    }, 0);
  }

  cart.totalPrice = totalPrice;
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
