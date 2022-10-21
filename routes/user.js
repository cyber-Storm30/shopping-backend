import express, { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyAdmin, verifyTokenAndAuthorization } from "./verifytoken.js";

const router = express.Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    const salt = bcrypt.genSalt(15);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User is deleted !!!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//only admin is allowed to get all user information
router.get("/find/:id", verifyAdmin, async (req, res) => {
  try {
    const newUser = await User.findById(req.params.id);
    const { password, ...otherInfo } = newUser._doc;
    res.status(200).json(otherInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all users

router.get("/", verifyAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const allUsers = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user stats

router.get("/stats", verifyAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
