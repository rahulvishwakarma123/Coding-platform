import dotenv from 'dotenv';
import connectDB from './src/Config/db.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './src/Routes/auth.routes.js';
import {protect} from './src/Middlewares/auth.middleware.js';
import {notFound, errorHandler} from './src/Middlewares/errorHandler.middleware.js';
import problemRoutes from './src/Routes/problem.routes.js';
const app = express();
dotenv.config();
 

// add security headers to protect your app
app.use(helmet());
// enables cross origin resource sharing (allow frontend to call your API)
app.use(cors());
// logs all the HTTP requests (helps in debugging)
app.use(morgan('dev'));
// parses cookies from the HTTP requests
app.use(cookieParser());
// parses JSON bodies (from requests with Content-Type: application/json)
app.use(express.json());
// parses URL-encoded bodies (from requests with Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

connectDB();

// // Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);

// // Test protected route example
app.get('/api/protected', protect, (req, res) => {
  res.json({ 
    success: true, 
    message: 'This is a protected route!', 
    user: req.user 
  });
});


// Error handling (ALWAYS at the end)
app.use(notFound);
app.use(errorHandler);





app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});