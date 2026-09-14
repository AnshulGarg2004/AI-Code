import {getAuth} from "firebase-admin/auth"
import app from "../config/firebase.js";
import User from "../models/user.model.js";

export const login = async (req, res) => {
    try {
        const {token} = req.body;
        const decoded = await getAuth(app).verifyIdToken(token);
        
        let user = await User.findOne({
            firebaseUid : decoded.uid
        });

        if(!user) {
            user =  await user.create({
                firebaseUid : decoded.uid,
                name : decoded.name,
                email : decoded.email,
                avtar : decoded.picture

            });


        }

        return res.status(200).json({message : "decoded the token", decoded })
    } catch (error) {
        return res.status(500).json({mesage: `login error : ${error}`})
    }
}