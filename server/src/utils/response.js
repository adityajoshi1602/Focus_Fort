const sendResponse = (res, statusCode, data, message = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    data: data || null,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

module.exports = { sendResponse };