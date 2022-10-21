import express from "express";
import Cart from "../models/Cart.js";
import {
  verifyTokenAndAuthorization,
  verifyAdmin,
  verifyToken,
} from "./verifytoken.js";

const router = express.Router();

//create a cart

router.post("/new", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const saveCart = await newCart.save();
    res.status(200).json(saveCart);
  } catch {
    res.status(500).json(err);
  }
});

//update the cart

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete the cart

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart is deleted !!!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user cart

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all cart

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const allCarts = await Cart.find();
    res.status(200).json(allCarts);
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;
