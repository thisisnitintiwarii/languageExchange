import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express()
const PORT = process.env.PORT


app.use(express.json()); // runs before the route handler

// it convert the JSON into a js object and attach it to the request

app.use("/api/auth", authRoutes)


app.listen(PORT, () => {
    console.log(`server is running in this port ${PORT} `)
    connectDB();
})

