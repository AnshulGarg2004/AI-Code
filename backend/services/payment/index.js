import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectdb.js";
import router from "./routes/payment.route.js";


dotenv.config();

const port = process.env.PORT || 8003;

const app = express();



app.use(express.json());

app.use('/', router)


app.get('/', (req, res)  => {
    
    res.status(200).json({message : "hello from payment service"});
})


app.listen( port ,async () => {
    console.log("Payment Server is successfully runing on port: ", port);
    await connectDB();
})