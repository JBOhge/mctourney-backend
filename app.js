const express = require('express');
const globalErrorHandler = require('./utils/errorHandler');
const tournamentRouter = require('./routes/tournamentRoutes');
const matchRouter = require('./routes/matchRoutes');
const userRouter = require('./routes/userRoutes');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');

// GLOBAL MIDDLEWARE
const app = express();

//Security
app.use(helmet());

//Rate Limitor
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP please try again later',
});
app.use('/api', limiter);

//CORS Configuration
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Cookie Parser
app.use(cookieParser());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tournaments', tournamentRouter);
app.use('/api/v1/matches', matchRouter);
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404));
});

module.exports = app;
