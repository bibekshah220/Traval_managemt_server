import express from "express";

// importing routes
import user_routes from "./routes/user.routes.js";
import booking_routes from "./routes/booking.routes.js";
import package_routes from "./routes/package.routes.js";
import auth_routes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.handler.milldeware.js";

const PORT = 8080;

const middleware1 = (req, res, next) => {
  console.log("i am middleware 1");
  console.log("req.user");
  next();
};

const middleware2 = (req, res, next) => {
  console.log("i am middleware 1");
  req.user = {
    name: "bibek",
    email: "bibekshah425@gmail.com",
  };
  next();
};

// * using middleware
// * creating express app instance
const app = express();
// app.use(middleware1);
// app.use(middleware1);

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

app.use((req, res, next) => {
  const message = `Can not ${req.method} on ${req.originalUrl}`;
  const error = new Error(message);
  next({
    message,
    error,
    statusCode: 404,
    status: "error",
  });
});

// * listenfing on server
app.listen(PORT, () => {
  console.log(`server is up and running at http://localhost:${PORT}`);
  console.log(`press ctrl + c to close server..`);
});

// !error handler

app.use(errorHandler);
