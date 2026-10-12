import express from "express"
import { createOrder, verify } from "../controller/payment.controller.js";
const router = express.Router();

router.post('/create', createOrder);
router.post('/verify',verify );

export default router