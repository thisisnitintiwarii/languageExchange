import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// send the request to the API
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow the frontend to send the cookies
  })
);

app.use(express.json());
app.use(cookieParser()); // runs before the route handler

// it convert the JSON into a js object and attach it to the request

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`server is running in this port ${PORT} `);
  connectDB();
});
