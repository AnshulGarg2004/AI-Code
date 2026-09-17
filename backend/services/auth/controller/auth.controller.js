import {getAuth} from "firebase-admin/auth"
import app from "../config/firebase.js";
import User from "../models/user.model.js";
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
    try {
        const {token} = req.body;
        const decoded = await getAuth(app).verifyIdToken(token);
        
        let user = await User.findOne({
            firebaseUid : decoded.uid
        });

        if(!user) {
            user = await User.create({
                firebaseUid : decoded.uid,
                name : decoded.name,
                email : decoded.email,
                avatar : decoded.picture

            });


        }

        const sessionId = crypto.randomUUID();
        await redis.set(`sessionId-${sessionId}`, JSON.stringify( {
            name : user.name,
            _id : user._id,
            email : user.email,
            avatar : user.avatar 
        }), "EX", 7 * 24 * 60 * 60)


        res.cookie("session", sessionId, {
            httpOnly : true,
            secure : false,
            samesite : "strict",
            maxAge : 7 * 24 * 60 *60 * 1000
        })



        return res.status(200).json({message : "decoded the token", decoded, user })
    } catch (error) {
        return res.status(500).json({mesage: `login error : ${error}`})
    }
}



export const logout = async (req, res ) => {
    try {
        const sessionId = req.cookies?.session;
        res.clearCookie("session");
        await redis.del(`sessionId-${sessionId}`)
        return res.status(200).json({message : "Logout successfully"})
    } catch (error) {
        console.log("logout error: ", error);
        
        return res.status(500).json({message : "Error in logout"});
    }
}