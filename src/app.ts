import authRoutes from "./routes/authRoutes";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";
import express from "express";
import notificationRoutes from "./routes/notificationRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(
  cors({
    origin: true, // this allows all origins
    credentials: true, // this allows cookies, authorization headers, etc.
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/notification", notificationRoutes);

export default app;
