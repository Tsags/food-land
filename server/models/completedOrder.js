import mongoose from "mongoose";

const CompletedOrderSchema = new mongoose.Schema(
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
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        customerId: { type: [String], required: true },
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const CompletedOrder = mongoose.model("CompletedOrder", CompletedOrderSchema);
export default CompletedOrder;
