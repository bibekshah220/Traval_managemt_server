export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";

  console.log("error Handler");
  res.status(statusCode).json({
    message,
    eeror: error.Error,
    status: "error",
    statusCode,
  });
};
