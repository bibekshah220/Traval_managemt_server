export const userRegister = (req, res) => {
  res.status(201).json({
    message: "User Registered",
    status: "success",
  });
};
export const login = (req, res) => {
  res.status(201).json({
    message: "User login success",
    status: "success",
  });
};
