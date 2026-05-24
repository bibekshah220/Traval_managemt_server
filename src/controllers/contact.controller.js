import AppError from "../middlewares/error-handler.middleware.js";
import { send_email } from "../utils/nodemailer.utils.js";
import { smpt_config } from "../config/config.js";

// * handle "contact us" form submissions
export const submit_contact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      throw new AppError(
        "name, email, subject and message are required",
        400
      );
    }

    const html = `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // deliver to the site inbox; fall back to the SMTP user if no "from" set
    const inbox = smpt_config.from || smpt_config.user;
    await send_email(inbox, `Contact form: ${subject}`, html);

    res.status(200).json({
      message: "Message sent successfully",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
