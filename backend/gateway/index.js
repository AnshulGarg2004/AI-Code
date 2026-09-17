import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan";
import proxy from "express-http-proxy"
import { protect } from "./middleware/protect.js";
import { getCurrentUser } from "./controllers/user.controller.js";
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))

app.use(express.json());
app.use(morgan("dev"));

app.use('/api/auth', proxy(process.env.AUTH_SERVICE));
app.use('/api/project', protect, proxy(process.env.PROJECT_SERVICE));


app.get('/api/get-current-user', protect, getCurrentUser);
app.get('/', (req, res)  => {
    
    res.status(200).json({message : "hello from gateway"});
})


app.listen( port ,() => {
    console.log("Server is successfully runing on port: ", port);
})