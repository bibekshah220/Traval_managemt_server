class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this, AppError);
  }
}

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  console.error("Error Handler:", error);
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    error: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default AppError;
