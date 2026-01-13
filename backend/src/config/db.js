const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI is missing in .env file");
      process.exit(1);
    }

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000
    });

    console.log("✅ MongoDB Connected Successfully");
    console.log(`📌 Host: ${conn.connection.host}`);
    console.log(`📌 Database: ${conn.connection.name}`);
  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log("Reason:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
