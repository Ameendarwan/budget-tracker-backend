import authRoutes from "./routes/authRoutes";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";
import express from "express";
import notificationRoutes from "./routes/notificationRoutes";
import path from "path";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(
  cors({
    origin: "*", // Allow all origins, or specify a specific domain (e.g., 'https://yourfrontend.com')
    methods: ["GET", "POST", "PUT", "DELETE"], // Adjust methods if needed
    allowedHeaders: ["Content-Type", "Authorization"], // Adjust headers if needed
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/notification", notificationRoutes);

export default app;
