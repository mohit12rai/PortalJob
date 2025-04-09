import express, { urlencoded } from 'express'
import dotenv from 'dotenv';
import connectDB from './database/database.js';
import jobSeekerRouter from './routes/jobSeekerRoute.js';
import RecruiterRouter from './routes/recruiterRoute.js';
import cors from "cors";
import cookieParser from "cookie-parser"
import jobRoute from './routes/jobRoute.js';
import Applicationrouter from './routes/applicationRoutes.js';
import LoginRouter from './routes/LoginRoute.js';
import ProviderRouter from './routes/ProviderRoute.js';
import path from  'path'
dotenv.config();


const app = express();
const __dirname=path.resolve();
const PORT = process.env.PORT || 5000;

// middleWares
app.use(express.json());
app.use(express.urlencoded({extended:true})) 
app.use(cookieParser())


app.use(
    cors({
      origin: process.env.FRONTEND_URL, // Allow frontend URL from .env
      credentials: true, // Allow cookies/session
      methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    })
  );



// api
app.use('/api/user',jobSeekerRouter)
app.use('/api/recruiter',RecruiterRouter)
app.use('/api/job',jobRoute)
app.use('/api/apply',Applicationrouter)
app.use('/api/auth',LoginRouter)
app.use('/api/authprovider',ProviderRouter)



app.use(express.static(path.join(__dirname, "client/dist")));
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});


// Sample Route
app.get('/', (req, res) => {
    res.send('Database Server is Running');
});


// Start Server
app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`);
});
