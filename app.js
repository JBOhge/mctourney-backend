const express = require('express');
const globalErrorHandler = require('./utils/errorHandler');
const tournamentRouter = require('./routes/tournamentRoutes');
const matchRouter = require('./routes/matchRoutes');
const userRouter = require('./routes/userRoutes');
const morgan = require('morgan');
const cors = require('cors');

// GLOBAL MIDDLEWARE
const app = express();

//CORS Configuration
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

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
