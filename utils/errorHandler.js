const AppError = require('./appError');

const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({ status: err.status, message: err.message });
  }
  //Unknown error
  else {
    console.error(err.name);

    res.status(500).json({ status: 'error', messsage: 'an error has occurred' });
  }
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token, please log in again', 401);

const handleJWTExpired = () => new AppError('Your token is expired, please log in again', 401);

module.exports = (err, req, res, next) => {
  //seting a default status code and status if one doesn't exist
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let newErr = Object.assign(err);

    if (newErr.name === 'CastError') newErr = handleCastErrorDB(newErr);
    if (newErr.code === 11000) newErr = handleDuplicateFieldsDB(newErr);
    if (newErr.name === 'ValidationError') newErr = handleValidationErrorDB(newErr);
    if (newErr.name === 'JsonWebTokenError') newErr = handleJWTError();
    if (newErr.name === 'TokenExpiredError') newErr = handleJWTExpired();

    sendErrorProd(newErr, res);
  }
};
