import dotenv from "dotenv";
import connectToDatabase from "./database.js";
import express from "express";

// Routes.
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
connectToDatabase();
const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);

app.listen(port, () => {
  console.log(`Server runs on port ${port}.`);
});
