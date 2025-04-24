import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { init } from "./config/dbconnect.js";
import authRoutes from "./routes/authorize.js";
import clientRoutes from "./routes/register_client.js";
import userRoutes from "./routes/register_user.js";

init();

app.use(express.json());

app.use("/", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})