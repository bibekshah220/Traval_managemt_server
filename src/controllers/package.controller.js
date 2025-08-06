export const create = (req, res) => {
  res.status(201).json({
    message: "package created ",
    status: "success",
  });
};
export const getAll = (req, res) => {
  res.status(200).json({
    message: "package fatched ",
    status: "success",
  });
};
export const getBayId = (req, res) => {
  res.status(200).json({
    message: "package fatched ",
    status: "success",
  });
};

export const remove = (req, res) => {
  res.status(200).json({
    message: "package deleted",
    status: "success",
  });
};

export const update = (req, res) => {
  res.status(200).json({
    message: "package updated",
    status: "success",
  });
};
