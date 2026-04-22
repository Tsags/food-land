import User from "./models/User.js";

export async function createAdminUser() {
  const exists = await User.findOne({ name: "mayonko" });
  if (!exists) {
    await User.create({
      name: "admin",
      password: "admin",
      isAdmin: true,
      qrCodeData: "admin",
    });
    console.log("Admin user created!");
  }
}
