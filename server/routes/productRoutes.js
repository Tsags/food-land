import express from "express";
import Product from "../models/Product.js";
import { protectRoute, admin } from "../authenticateMiddleware/authMiddleware.js";
import asyncHandler from "express-async-handler";

const productRoutes = express.Router();

const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
};

const createNewProduct = asyncHandler(async (req, res) => {
  const { name, category, stock, price, image, productIsNew, description, allergies, features } = req.body;
  const newProduct = await Product.create({
    name,
    category,
    stock,
    price,
    image: "/images/" + image,
    productIsNew,
    description,
    allergies,
    features,
  });
  await newProduct.save();
  const products = await Product.find();
  if (newProduct) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("Product could not be uploaded.");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, image, category, stock, price, id, productIsNew, description, allergies, features } = req.body;
  const product = await Product.findById(id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = "/images/" + image;
    product.category = category;
    product.stock = stock;
    product.productIsNew = productIsNew;
    product.allergies = allergies;
    product.features = features;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
});

productRoutes.route("/").get(getProducts);
productRoutes.route("/:id").get(getProduct);
productRoutes.route("/").post(protectRoute, admin, createNewProduct);
productRoutes.route("/").put(protectRoute, admin, updateProduct);
productRoutes.route("/:id").delete(protectRoute, admin, deleteProduct);

export default productRoutes;
