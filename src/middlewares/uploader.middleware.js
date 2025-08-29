import multer from "multer";
import fs from "fs";
import path from "path";
import AppError from "./error.handler.middleware.js";
export const uploader = (destination = "/") => {
  const upLoad_folder = "uploads" + destination;
  const size_limit = 5 * 1024 * 1024; // 5mb
  const allowed_extenstions = [
    "png",
    "jpg",
    "jpeg",
    "webp",
    "svg",
    "gif",
    "aviff",
  ];

  const stroage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, upLoad_folder);
      if (!fs.existsSync(upLoad_folder)) {
        fs.mkdirSync(upLoad_folder, { recursive: true });
      }
    },
    filename: (req, file, cb) => {
      const unique_name = Date.now() + "-" + file.originalname;
      cb(null, unique_name);
    },
  });

  // file filter
  const fileFilter = (req, file, cb) => {
    // get file extenstion
    const ext_name = path.extname(file.originalname).replace(".", "");

    // check if ext_name is allowed

    if (!allowed_extenstions.includes(ext_name)) {
      const error = new AppError(
        `${ext_name} is not allowed.Only ${allowed_extenstions.join(
          ","
        )}format is supported`,
        400
      );
      cb(error);
    }
    cb(null, true);
  };

  const upload = multer({
    storage: stroage,
    fileFilter,
    limits: { fileSize: size_limit },
  });
  return upload;
};
