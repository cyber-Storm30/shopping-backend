import express from "express";
import Order from "../models/Order.js";
import {
  verifyTokenAndAuthorization,
  verifyAdmin,
  verifyToken,
} from "./verifytoken.js";

const router = express.Router();

//create a Order

router.post("/new", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const saveOrder = await newOrder.save();
    res.status(200).json(saveOrder);
  } catch {
    res.status(500).json(err);
  }
});

//update the Order

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete the Order

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order is deleted !!!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user Order

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const Order = await Order.findOne({ userId: req.params.userId });
    res.status(200).json(Order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all Order

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get monthly income by orders

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
