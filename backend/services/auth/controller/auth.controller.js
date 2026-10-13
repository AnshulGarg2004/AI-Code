import { getAuth } from "firebase-admin/auth"
import app from "../config/firebase.js";
import User from "../models/user.model.js";
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = await getAuth(app).verifyIdToken(token);

        let user = await User.findOne({
            firebaseUid: decoded.uid
        });

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture

            });


        }

        const sessionId = crypto.randomUUID();
        await redis.set(`user-session-${user._id}`, sessionId, "EX", 7 * 24 * 60 * 60)
        await redis.set(`sessionId-${sessionId}`, JSON.stringify({
            name: user.name,
            _id: user._id,
            email: user.email,
            avatar: user.avatar,
            credits: user.credits
        }), "EX", 7 * 24 * 60 * 60)


        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV  == "development" ? false : true,
            sameSite: process.env.NODE_ENV  == "development" ?  "strict" :  "none" ,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })



        return res.status(200).json({ message: "decoded the token", decoded, user })
    } catch (error) {
        return res.status(500).json({ mesage: `login error : ${error}` })
    }
}



export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies?.session;
        res.clearCookie("session");
        await redis.del(`sessionId-${sessionId}`)
        return res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        console.log("logout error: ", error);

        return res.status(500).json({ message: "Error in logout" });
    }
}


export const deductCredits = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId) {
            return res.status(404).json({ message: "User id not found" });
        }

        const user = await User.findByIdAndUpdate({ _id: userId, credits: { $gte: amount } }, {
            $inc: {
                credits: -amount
            }
        }, { returnDocument: "after" }).select("credits");

        if (!user) {
            return res.status(400).json({ message: "Insufficient credits" });
        }

        const sessionId = await redis.get(`user-session-${user._id}`);
        await redis.set(`sessionId-${sessionId}`, JSON.stringify({
            name: user.name,
            _id: user._id,
            email: user.email,
            avatar: user.avatar,
            credits: user.credits
        }), "EX", 7 * 24 * 60 * 60)


        return res.status(200).json({credits : user.credits})


    } catch (error) {
        console.log("Error in deduct credits controller: ", error);
        return res.status(500).json({ message: "Error in deduct credits controller" });


    }
}

export const addCredits = async (req, res) => {
    try {
        const { userId,  amount } = req.body;
        if (!userId) {
            return res.status(404).json({ message: "User id not found" });
        }

        const creditsToAdd = Number(amount);
        if (!Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
            return res.status(400).json({ message: "A positive credit amount is required" });
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({ message: "Insufficient credits" });
        }

        user.credits = (user.credits || 0) + creditsToAdd;

        await user.save();

        const sessionId = await redis.get(`user-session-${user._id}`);
        await redis.set(`sessionId-${sessionId}`, JSON.stringify({
            name: user.name,
            _id: user._id,
            email: user.email,
            avatar: user.avatar,
            credits: user.credits
        }), "EX", 7 * 24 * 60 * 60)


        return res.status(200).json( user.credits)


    } catch (error) {
        console.log("Error in add credits controller: ", error);
        return res.status(500).json({ message: "Error in add credits controller" });


    }
}