import mongoose from "mongoose";

// ponytail: one singleton document keyed by `key`, not a row per field.
// The site has exactly one of each block, so a collection of blocks would
// buy nothing but joins.
const content_schema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "site",
    },

    // the wordmark, used by the header, the auth panel and the footer
    brand: { type: String, required: [true, "Brand name is required"] },

    // logo lockups: the dark one for light surfaces, the light one for dark
    // surfaces, and the glyph on its own for tight spaces
    logo: {
      path: String,
      light_path: String,
      mark_path: String,
    },

    hero: {
      badge: { type: String },
      title: { type: String, required: [true, "Hero title is required"] },
      subtitle: { type: String, required: [true, "Hero subtitle is required"] },
      cta_label: { type: String, default: "Explore More" },
      cta_link: { type: String, default: "/packages" },
      secondary_cta_label: { type: String },
      secondary_cta_link: { type: String },
      cover_image: {
        path: String,
        public_id: String,
      },
    },

    // the "why book here" row under the hero
    trust_points: [
      {
        icon: String,
        title: String,
        description: String,
      },
    ],

    // headings for the listing sections, so copy is not spread across components
    sections: {
      popular_packages: { title: String, subtitle: String },
      categories: { title: String, subtitle: String },
      about_categories: { title: String, subtitle: String },
    },

    // the brand panel beside the sign-in and sign-up forms
    auth: {
      heading: { type: String },
      body: { type: String },
      footnote: { type: String },
    },

    about: {
      title: { type: String, required: [true, "About title is required"] },
      subtitle: { type: String },
      paragraphs: [{ type: String }],
      highlights: [
        {
          icon: String,
          value: String,
          label: String,
        },
      ],
    },

    contact: {
      title: { type: String },
      subtitle: { type: String },
      address: { type: String },
      phone: { type: String },
      email: { type: String },
      office_hours: { type: String },
      map_url: { type: String },
      form_title: { type: String },
      form_subtitle: { type: String },
    },

    footer: {
      tagline: { type: String },
      socials: [
        {
          label: String,
          url: String,
        },
      ],
      copyright: { type: String },
    },
  },
  { timestamps: true }
);

const Content = mongoose.model("content", content_schema);
export default Content;
