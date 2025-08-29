import cloudinary from "../config/cloudinary.config.js";

import AppError from "../middlewares/error.handler.middleware.js";
import fs from "fs";

export const upload_file = async (file, dest = "/") => {
  try {
    const folder_name = "/Traval managemt" + dest;
    const { public_id, secure_url } = await cloudinary.uploader.upload(file, {
      folder: folder_name,
      unique_filename: true,
    });

    // delete image/file from uploadres if it exists

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    return {
      path: secure_url,
      public_id,
    };
  } catch (error) {
    console.log(error);
    throw new AppError("file uploading error", 422);
  }
};
