import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import { AppError } from "./utils/error.js"
import { db_connect } from "./DB/db.config.js"
import v1Router from "./src/routers/v1Router.js"

// env config
dotenv.config();

// init app
const app = express();

// port 
 const PORT = process.env.PORT || 5001;

// db connection
db_connect();

// middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(morgan(process.env.MOOD === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cookieParser())
app.use(helmet())
app.use('/api/v1',v1Router)
app.all('*',(req,res,next)=>{
    next(new AppError('Route not found',404,'failed'))
})
app.use((error, req, res, next) => {
    const { message, status, stack } = error

    res.status(status || 500).json({
        message,
        ...(process.env.MODE === 'development' && { stack }),
    })
})


// start the server

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});