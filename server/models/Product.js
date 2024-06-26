import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    productIsNew: {
      type: Boolean,
      default: false,
    },
    allergies: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    numRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamp: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
