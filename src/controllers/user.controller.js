export const profile = (req, res) => {
  res.status(200).json({
    message: "profile updated",
    status: "success",
  });
};
export const getBayId = (req, res) => {
  res.status(200).json({
    message: "user by id fetched",
    status: "success",
  });
};

export const userbyid = (req, res) => {
  res.status(200).json({
    message: "all user  fetched",
    status: "success",
  });
};

export const remove = (req, res) => {
  res.status(200).json({
    message: `User with ID deleted`,
    status: "success",
  });
};
