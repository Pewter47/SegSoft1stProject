import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { init } from "./config/dbconnect.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// Initialize the database (create tables, etc.)
init();
const app = express();
// Built-in middleware to parse JSON
app.use(express.json());
// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 3001;
// Server initialisation
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})