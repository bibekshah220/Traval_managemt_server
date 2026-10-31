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
// Kick the connection off at boot for the long-running case. On serverless
// the container may start cold, so each request also awaits it below.
connect_db();

// * using middleware
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
// Every request waits for a live connection before it reaches a route.
// Without this mongoose silently buffers queries against a connection that
// may never open, and the request dies with an opaque "buffering timed out"
// instead of the actual reason Atlas refused.
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

// serving uploads as static file (local only — the serverless disk is
// ephemeral, and uploaded files live on Cloudinary once processed)
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

// * start server
// On Vercel the platform invokes the exported app; binding a port there
// would hold the invocation open and time out.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Press Ctrl + C to stop the server`);
  });
}

export default app;
