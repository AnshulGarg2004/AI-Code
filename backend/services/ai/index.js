import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectdb.js";
import router from "./routes/ai.route.js";



dotenv.config();

const port = process.env.PORT || 8004;

const app = express();



app.use(express.json());
app.use('/', router);


app.get('/', (req, res)  => {
    
    res.status(200).json({message : "hello from ai service"});
})


app.listen( port ,async () => {
    console.log("AI Server is successfully runing on port: ", port);
    await connectDB();
})