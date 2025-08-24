import "dotenv/config";

import express from "express";

// importing routes
import user_routes from "./routes/user.routes.js";
import booking_routes from "./routes/booking.routes.js";
import package_routes from "./routes/package.routes.js";
import auth_routes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.handler.middleware.js";
import { connect_db } from "./config/mongodb.config.js";

const PORT = process.env.PORT;

// ! connecting to database

connect_db();

const middleware1 = (req, res, next) => {
  console.log("i am middleware 1");
  console.log(req.user);
  next();
};

const middleware2 = (req, res, next) => {
  console.log("i am middleware 2");
  req.user = {
    name: "bibek",
    email: "bibekshah425@gmail.com",
  };
  next();
};

// * using middleware
const app = express();
app.use(middleware1);
app.use(middleware2);
app.use(express.json({ limit: "10mb" }));

// ping route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is up & running",
  });
});

// ! using routes
app.use("/user", user_routes);
app.use("/package", package_routes);
app.use("/auth", auth_routes);
app.use("/booking", booking_routes);

// 404 handler
app.use((req, res, next) => {
  const message = `Cannot ${req.method} on ${req.originalUrl}`;
  const error = new Error(message);
  next({
    message,
    error,
    statusCode: 404,
    status: "error",
  });
});

// ! error handler
app.use(errorHandler);

// * start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Press Ctrl + C to stop the server`);
});
