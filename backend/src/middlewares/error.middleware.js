const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered for '${field}'. Please use another value.`;
    error = new Error(message);
    error.statusCode = 400;
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authentication token. Please log in again.';
    error = new Error(message);
    error.statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    const message = 'Authentication token has expired. Please log in again.';
    error = new Error(message);
    error.statusCode = 401;
  }
  const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
export default errorHandler;
