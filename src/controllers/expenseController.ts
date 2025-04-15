import { NextFunction, Request, Response } from "express";

import Expense from "../models/Expense";
import { Notification } from "../models/Notification";
import dayjs from "dayjs";
import mongoose from "mongoose";

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { title, price, date } = req.body;

    const expense = await Expense.create({
      userId: req?.user?.id,
      title,
      price,
      date,
    });
    // Create Notification
    await Notification.create({
      userId: req?.user?.id,
      title: `${title}`,
      message: `added successfully.`,
      type: "success",
    });
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserExpenses = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const sortOption = req.query.sortOption as string;
    const sortDate = req.query.sortDate as string;

    const userId = req.user?.id;

    // Sorting logic based on dropdown values
    let sort: { [key: string]: 1 | -1 } = { createdAt: -1 }; // default

    switch (sortOption) {
      case "price_desc":
        sort = { price: -1 };
        break;
      case "price_asc":
        sort = { price: 1 };
        break;
      case "date_desc":
        sort = { date: -1 };
        break;
      case "date_asc":
        sort = { date: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const query: any = {
      userId,
      $or: [{ title: new RegExp(search, "i") }],
    };

    if (sortDate) {
      const parsedDate = new Date(sortDate);
      if (!isNaN(parsedDate.getTime())) {
        query.date = { $gte: parsedDate };
      }
    }

    const total = await Expense.countDocuments(query);

    const expenses = await Expense.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "firstName lastName email phoneNumber role");

    res.json({
      expenses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    // Create Notification
    await Notification.create({
      userId: req?.user?.id,
      title: `${deletedExpense?.title}`,
      message: `was removed.`,
      type: "error",
    });
    res.json({ message: "Expense deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // Create Notification
    await Notification.create({
      userId: req?.user?.id,
      title: `${updated?.title}`,
      message: `updated successfully.`,
      type: "info",
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getExpenseAnalysis = async (req: Request, res: Response) => {
  try {
    const now = dayjs();
    const filter = req.query.range as string;

    let startDate: dayjs.Dayjs;
    switch (filter) {
      case "last_month":
        startDate = now.subtract(1, "month").startOf("month");
        break;
      case "last_6_months":
        startDate = now.subtract(6, "month").startOf("month");
        break;
      case "last_12_months":
      default:
        startDate = now.subtract(12, "month").startOf("month");
        break;
    }

    const endDate = now.endOf("month");

    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req?.user?.id),
          date: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthDiff = now.diff(startDate, "month") + 1;

    const result = Array.from({ length: monthDiff }, (_, i) => {
      const month = startDate.add(i, "month");
      const match = expenses.find(
        (e) => e._id.year === month.year() && e._id.month === month.month() + 1
      );

      return {
        month: month.format("MMM"),
        total: match ? match.total : 0,
      };
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
