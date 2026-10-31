import "dotenv/config";

import express from "express";

// importing routes
import user_routes from "./routes/user.routes.js";
import booking_routes from "./routes/booking.routes.js";
import package_routes from "./routes/package.routes.js";
import auth_routes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { connect_db } from "./config/mongodb.config.js";
import category_route from "./routes/category.route.js";
import contact_route from "./routes/contact.route.js";
import content_route from "./routes/content.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const PORT = process.env.PORT;

// ! connecting to database
connect_db();

// * using middleware
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
// Without this a dead connection surfaces as "buffering timed out", not its cause.
app.use(async (req, res, next) => {
  try {
    await connect_db();
    next();
  } catch (error) {
    next({
      message:
        "Database connection failed. Check DB_URI and the Atlas network access list.",
      error,
      statusCode: 503,
      status: "error",
    });
  }
});

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// serving uploads as static file (local only — the serverless disk is ephemeral)
if (!process.env.VERCEL) {
  app.use("/uploads", express.static("uploads/"));
}

// ping route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is up & running",
  });
});

// ! using routes (client baseURL is ".../api/")
app.use("/api/user", user_routes);
app.use("/api/package", package_routes);
app.use("/api/auth", auth_routes);
app.use("/api/booking", booking_routes);
app.use("/api/category", category_route);
app.use("/api/contact", contact_route);
app.use("/api/content", content_route);

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

// * start server — binding a port on Vercel would hold the invocation open
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Press Ctrl + C to stop the server`);
  });
}

export default app;
