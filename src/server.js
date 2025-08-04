import express from "express";

const PORT = 8080;

// * creating express app instance
const app = express();

// ping route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is up & running",
  });
});

// * listenfing on server
app.listen(PORT, () => {
  console.log(`server is up and running at http://localhost:${PORT}`);
  console.log(`press ctrl + c to close server..`);
});

// * crud user
// * register user
// * implement actual Register user logic
app.post("/auth/register", (req, res) => {
  res.status(201).json({
    message: "User Registered",
    status: "success",
  });
});

// * login
// * implement actual  user login  logic

app.post("/auth/login", (req, res) => {
  res.status(201).json({
    message: "User login success",
    status: "success",
  });
});

// * update profile
app.put("/user/:id", (req, res) => {
  res.status(200).json({
    message: "profile updated",
    status: "success",
  });
});

// get user by id
app.get("/user:id", (req, res) => {
  res.status(200).json({
    message: "user by id fetched",
    status: "success",
  });
});

// user
// package
// Booking

// contollers

// to do package
// delete
// update
