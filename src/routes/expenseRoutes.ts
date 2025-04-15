import {
  createExpense,
  deleteExpense,
  getExpenseAnalysis,
  getUserExpenses,
  updateExpense,
} from "../controllers/expenseController";

import { authenticate } from "../middlewares/auth";
import express from "express";

const router = express.Router();

router.use(authenticate);

router.post("/", createExpense);
router.get("/", getUserExpenses);
router.get("/analysis", getExpenseAnalysis);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
