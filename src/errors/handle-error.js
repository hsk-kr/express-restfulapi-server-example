export default (err, req, res, next) => {
  if (err && err.statusCode && err.message) {
    const { statusCode, message } = err;
    return res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
    });
  }

  return next();
};
