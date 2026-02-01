const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error stack in development for easier debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Error Stack:', err.stack);
  } else {
    console.error('🔥 Error:', err.message);
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };