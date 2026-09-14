import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    firebaseUid : {
        type : String, 
        required : true, 
        unique : true,
        trim : true,
    },
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase: true,
        unique : true
    },
    avatar : {
        type : String,
        default : ""
    }

}, {timestamps: true});

const User =mongoose.models.User || mongoose.model("User", userSchema);
export default User;