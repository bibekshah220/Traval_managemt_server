import express from "express";

// importing routes
import user_routes from "./routes/user.routes.js";
import booking_routes from "./routes/booking.routes.js";
import package_routes from "./routes/package.routes.js";
import auth_routes from "./routes/auth.routes.js";

const PORT = 8080;

// * creating express app instance
const app = express();

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

// * listenfing on server
app.listen(PORT, () => {
  console.log(`server is up and running at http://localhost:${PORT}`);
  console.log(`press ctrl + c to close server..`);
});
