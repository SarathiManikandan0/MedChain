const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./.env" });

// Load environment variables
const DB = "MongoURI"; // Assuming DATABASE is the environment variable name for MongoDB connection URI

// Handle uncaught exceptions
process.on("uncaughtException", error => {
  console.log("unhandledRejection shutting down the application");
  console.log(error.name, error.message);
  process.exit(1);
});

// Connect to MongoDB using Mongoose
mongoose.connect(DB, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true // Add this option for MongoDB driver
}).then((con) => {
  console.log("DB connected successfully");
  console.log(process.env.NODE_ENV);
}).catch(error => {
  console.error("MongoDB connection error:", error);
  process.exit(1);
});

// Define the port for your Express server
const port = process.env.PORT || 5000;

// Start the Express server
const server = app.listen(port, () => {
  console.log(`You are listening to the port ${port}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", err => {
  console.log("Unhandled Rejection. Shutting down the application");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
