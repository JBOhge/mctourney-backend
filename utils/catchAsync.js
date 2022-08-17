module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
    //when calling next() with a param express knows its an error
    //and goes directly to the globalErrorHandler
  };
};
