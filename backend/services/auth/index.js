import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectdb.js";
import router from "./routes/auth.route.js";

dotenv.config();

const port = process.env.PORT || 8001;

const app = express();



app.use(express.json());


app.use('/', router )
app.get('/', (req, res)  => {
    
    res.status(200).json({message : "hello from auth service"});
})


app.listen( port ,async () => {
    console.log("Auth Server is successfully runing on port: ", port);
    await connectDB();
})