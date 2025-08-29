import nodemailer from "nodemailer";
import AppError from "../middlewares/error.handler.middleware.js";
import { smpt_config } from "../config/config.js";

// transport

const transpoter = nodemailer.createTransport({
  host: smpt_config.host,
  port: smpt_config.port,
  secure: parseInt(smpt_config.port) === 465 ? true : false,
  service: smpt_config.service,
  auth: {
    user: smpt_config.user,
    pass: smpt_config.pass,
  },
});

// send mail
export const send_mail = async (
  to,
  subject,
  html,
  cc = null,
  bcc = null,
  attachment = null
) => {
  try {
    const message_option = {
      from: `"Traval management" <${smpt_config.from}>`,
      to,
      subject,
      html,
    };
    if (cc) {
      message_option["cc"] = cc;
    }

    if (bcc) {
      message_option["bcc"] = bcc;
    }

    if (attachment) {
      message_option["attachment"] = attachment;
    }

    await transpoter.sendMail({});
  } catch (error) {
    console.log(error);
    throw new AppError("Email sending error.", 500);
  }
};
