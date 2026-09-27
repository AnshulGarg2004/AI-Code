import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Db connected successfully 🎉");
        
    } catch (error) {
        console.log("Error connecting db ", error);
    }
}

export default connectDB