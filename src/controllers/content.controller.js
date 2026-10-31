import AppError from "../middlewares/error-handler.middleware.js";
import Content from "../models/content.model.js";

const SITE_KEY = "site";

//* public — the whole site content block
export const get_content = async (req, res, next) => {
  try {
    const content = await Content.findOne({ key: SITE_KEY });

    if (!content) {
      throw new AppError("Site content has not been set up yet", 404);
    }

    res.status(200).json({
      message: "site content fetched",
      status: "success",
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

//* admin — patch any subset of the blocks
export const update_content = async (req, res, next) => {
  try {
    const BLOCKS = [
      "brand",
      "logo",
      "hero",
      "about",
      "contact",
      "footer",
      "trust_points",
      "sections",
      "auth",
    ];

    const update = {};
    for (const block of BLOCKS) {
      if (req.body[block] !== undefined) update[block] = req.body[block];
    }

    if (!Object.keys(update).length) {
      throw new AppError(
        `provide at least one of ${BLOCKS.join(", ")}`,
        400
      );
    }

    const content = await Content.findOneAndUpdate(
      { key: SITE_KEY },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!content) {
      throw new AppError("Site content has not been set up yet", 404);
    }

    res.status(200).json({
      message: "site content updated",
      status: "success",
      data: content,
    });
  } catch (error) {
    next(error);
  }
};
