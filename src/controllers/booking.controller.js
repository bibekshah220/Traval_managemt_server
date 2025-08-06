export const getAll = (req, res) => {
  res.status(200).json({
    message: "booking fetched",
    status: "success",
  });
};

export const create = (req, res) => {
  res.status(201).json({
    message: "booking created",
    status: "success",
  });
};
export const update = (req, res) => {
  res.status(200).json({
    message: "booking updated",
    status: "success",
  });
};
export const getBayId = (req, res) => {
  res.status(200).json({
    message: "booking fatched ",
    status: "success",
  });
};
export const remove = (req, res) => {
  res.status(200).json({
    message: "booking deleted",
    status: "success",
  });
};
