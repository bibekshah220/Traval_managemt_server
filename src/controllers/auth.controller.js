// implement actual register user logic
const users = [];

export const userRegister = (req, res) => {
  const data = req.body;
  console.log(data);
  if (!data) {
    res.status(400).json({
      message: "data exprected",
      status: "error",
    });
    return;
  }
  users.push(data);
  res.status(201).json({
    message: "User Registered",
    status: "success",
  });
};

export const login = (req, res) => {
  // * implement actual user login logic
  const data = req.body;
  console.log(data);
  if (!data) {
    res.status(400).json({
      message: " data expected",
      status: "error",
    });
    return;
  }
  const user = users.find((usr) => usr.email === data.email);
  if (!user) {
    res.status(400).json({
      message: " email or password does not match",
      status: "error",
    });
    return;
  }

  const isPassMatch = user.password === data.password;
  if (!isPassMatch) {
    res.status(400).json({
      message: " email or password does not match",
      status: "error",
    });
    return;
  }
  res.status(201).json({
    message: "User login success",
    status: "success",
  });
};
