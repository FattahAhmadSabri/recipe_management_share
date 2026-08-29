const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
  token,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    token,
  });
};

const errorResponse = (
  res,
  statusCode = 500,
  message = "Something went wrong",
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
