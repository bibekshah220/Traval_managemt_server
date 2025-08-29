export const mongodb_config = {
  url: process.env.DB_URI,
  db_name: process.env.DB_NAME,
};

export const cloudinary_config = {
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
};

export const jwt_config = {
  jwt_secret: process.env.JWT_SECRET,
  expires_in: process.env.JWT_EXPIRES_IN,
};

export const smpt_config = {
  host: process.env.SMPT_HOST,
  port: process.env.SMPT_PORT,
  service: process.env.SMPT_SERVICE,
  user: process.env.SMPT_USER,
  pass: process.env.SMPT_PASS,
  from: process.env.SMPT_FROM,
};
