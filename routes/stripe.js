import express, { Router } from "express";
import stripe from ("stripe")(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/payment")



export default router;
