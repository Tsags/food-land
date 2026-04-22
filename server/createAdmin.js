import User from "./models/User.js";
import bcrypt from "bcrypt";

export async function createAdminUser() {
  const exists = await User.findOne({ name: "admin" });
  if (!exists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin", salt);
    await User.collection.insertOne({
      name: "admin",
      password: hashedPassword,
      isAdmin: true,
      qrCodeData: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Admin user created!");
  }
}
