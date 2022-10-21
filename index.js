import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authUrl from "./routes/auth.js";
import productUrl from "./routes/product.js";
import cartUrl from "./routes/cart.js";
import userUrl from "./routes/user.js";

//uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Shutting down the server due to uncaughtException ");
  process.exit(1);
});

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
};

mongoose.connect(process.env.MONGO_URL, options).then(() => {
  console.log("Database is connected");
});

app.use("/api/auth", authUrl);
app.use("/api/product", productUrl);
app.use("/api/cart", cartUrl);
app.use("/api/user", userUrl);

const server = app.listen(process.env.PORT, () => {
  console.log("Server Connected", process.env.PORT);
});

//unhandledPromise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Shutting down the server due to unhandledpromise rejection");

  server.close(() => {
    process.exit(1);
  });
});
