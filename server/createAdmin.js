import User from "./models/User.js";

export async function createAdminUser() {
  const exists = await User.findOne({ name: "mayonko" });
  if (!exists) {
    await User.create({
      name: "mayonko",
      password: "mayonko",
      isAdmin: true,
      qrCodeData: "mayonko",
    });
    console.log("Admin user created!");
  }
}
