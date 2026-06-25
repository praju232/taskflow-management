const mongoose = require("mongoose");

async function connectDB() {
  try {
    console.log(process.version);
    console.log("Mongoose:", mongoose.version);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;