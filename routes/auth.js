import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(15);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("No user found !!!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(401).json("Wrong Credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );
    const { password, ...newUser } = user._doc;
    res.status(200).json({ newUser, accessToken });
  } catch (err) {
    res.status(500).json("Login Failed");
  }
});

export default router;
