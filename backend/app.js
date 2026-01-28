import express from 'express';
import product from './routes/productRoutes.js';
import user from './routes/userRoutes.js';
import order from './routes/orderRoutes.js';
import payment from './routes/paymentRoutes.js';
import delivery from './routes/deliveryRoute.js';
import errorHandleMiddleware  from './middleware/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv'
import cors from 'cors';

const app=express();

dotenv.config({path:'backend/config/config.env'})

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }));

// Route
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)
app.use("/api/v1",delivery)

app.use(errorHandleMiddleware)

export default app;