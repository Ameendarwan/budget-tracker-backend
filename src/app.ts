import authRoutes from "./routes/authRoutes";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";
import express from "express";
import notificationRoutes from "./routes/notificationRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Allow frontend on this port
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/notification", notificationRoutes);

export default app;
