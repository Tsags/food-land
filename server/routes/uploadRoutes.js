import express from "express";
import asyncHandler from "express-async-handler";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadRoutes = express.Router();

const storage = multer.diskStorage({
  destination: join(__dirname, "..", "..", "client", "public", "images"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const uploadImage = asyncHandler(async (req, res) => {
  try {
    const file = req.file;

    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

uploadRoutes.route("/").post(upload.single("image"), uploadImage);

export default uploadRoutes;
