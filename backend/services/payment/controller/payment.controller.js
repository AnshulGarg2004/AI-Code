import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import crypto from "crypto"
import { addCredits } from "../utils/updateCredits.js";

const Plans = {
    pro: {
        name: "Pro",
        amount: 29900,
        credits: 500,
    },

    team: {
        name: "Team",
        amount: 79900,
        credits: 2000,
    },
}

export const createOrder = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(200).json({ message: "User id not found" });
        }

        const { plan } = req.body;
        const selectPlan = Plans[plan];

        if (!selectPlan) {

            return res.status(200).json({ message: "selected plan not found" });
        }

        const order = await razorpay.orders.create({
            amount: selectPlan.amount,
            currency: "INR",
            receipt: `receipt-${Date.now()}`,
            notes: { userId, plan }
        })


        const payment = await Payment.create({
            userId,
            plan,
            amount: selectPlan.amount,
            credits: selectPlan.credits,
            razorpayOrderId: order.id,
            currency: "INR",
            status: "created"

        })

        return res.status(200).json({
            message: "razorpay order created", order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            plan: {
                name: selectPlan.name,
                credits: selectPlan.credits
            },
            key_id : process.env.RAZORPAY_KEY_ID
        })
    } catch (error) {

        console.log("error in create order controller: ", error);
        return res.status(500).json({message : "error in create order controller"})
        

    }
}
export const verify = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ message: "User id not found" });
        }

        const { razorpay_order_id, razorpay_payment_id , razorpay_signature} = req.body;
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {

            return res.status(400).json({ message: "razorpay_order_id razorpay_payment_id razorpay_signature are required" });
        }

        const payment = await Payment.findOne({
            
            razorpayOrderId: razorpay_order_id,
           
        })

        if(!payment) {

            return res.status(400).json({ message: "payment not found not found" });
        }
        
        if(payment.status == "paid") {
            return res.status(400).json({ message: "payment is already verified" });
            
        }

        const genSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");  


        if(genSign !== razorpay_signature) {
            payment.status = "failed";
            await payment.save();
            
            return res.status(400).json({message : "invalid payment signature"})
        }
        
        payment.status = "paid";
        payment.razorpayPayemntId = razorpay_payment_id;

        await payment.save();

        const data = await addCredits({userId, credits : payment.credits});


        return res.status(200).json({
            message: "payment verified" })
    } catch (error) {

        console.log("error in payment verify controller: ", error);
        return res.status(500).json({message : "error in payment verify controller"})
        

    }
}
