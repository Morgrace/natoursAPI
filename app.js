import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import compression from 'compression';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//define view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// switch query parser from "simple" to "extended"
app.set('query parser', 'extended');

//middleware

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//SECURITY HTTP HEADERS
app.use(helmet());

//compression
app.use(compression());

// LIMIT REQUEST FROM SAME API
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// /More strict rate limiting for auth routes
const authLimiter = rateLimit({
  limit: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many authentication attempts, please try again later!',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/users/signup', authLimiter);
app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/users/forgotPassword', authLimiter);

//BODY PARSER
app.use(
  express.json({
    limit: '10kb',
  }),
); //enables the use of req.body

//DATA SANITIZATION AGAINST NO NOSQL QUERY INJECITON
// this won't work use @exortek/express-mongo-sanitize package instead
// app.use(mongoSanitize());

//DATA SANITIZATION AGAINST XSS
app.use(xss());

//prevent paramter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleDateString();
  next();
});

//routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/', viewRouter);

//for undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
export default app;
