import "dotenv/config";
import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Tour_package from "../models/package.model.js";
import User from "../models/user.model.js";
import Content from "../models/content.model.js";
import { hash_password } from "../utils/bcrypt.utils.js";
import { Role, Gender, package_cost_type } from "../config/constants.js";

// ponytail: images are hot-linked Unsplash URLs, not Cloudinary uploads.
// The models only store { path, public_id }, so seeding needs no upload step.
const img = (id, public_id) => ({
  path: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`,
  public_id,
});

const days_from_now = (n) => {
  const d = new Date();
  d.setHours(8, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};

const categories = [
  {
    name: "Trekking",
    description:
      "Multi-day walking routes through the Himalaya, from teahouse trails to high passes above 5,000m.",
    logo: img("photo-1551632811-561732d1e306", "seed/categories/trekking"),
  },
  {
    name: "Mountain Expedition",
    description:
      "Guided climbs on technical peaks with fixed rope, high-altitude camps and a full Sherpa support team.",
    logo: img("photo-1454496522488-7a8e488e8606", "seed/categories/expedition"),
  },
  {
    name: "Cultural Tour",
    description:
      "Heritage walks through medieval durbar squares, monasteries and living temple towns of the Kathmandu valley.",
    logo: img("photo-1605640840605-14ac1855827b", "seed/categories/cultural"),
  },
  {
    name: "Wildlife Safari",
    description:
      "Jeep and canoe safaris in the lowland Terai national parks, tracking rhino, gharial and Bengal tiger.",
    logo: img("photo-1549366021-9f761d450615", "seed/categories/wildlife"),
  },
  {
    name: "Adventure Sports",
    description:
      "Short adrenaline trips built around rafting, bungee, canyoning and tandem paragliding over the lakes.",
    logo: img("photo-1530866495561-507c9faab2ed", "seed/categories/adventure"),
  },
  {
    name: "Pilgrimage",
    description:
      "Slow-paced spiritual journeys to the major Hindu and Buddhist sites, with time set aside for ceremony.",
    logo: img("photo-1544735716-392fe2489ffa", "seed/categories/pilgrimage"),
  },
];

const packages = [
  {
    name: "Everest Base Camp Trek",
    category: "Trekking",
    description:
      "Twelve days from Lukla to Everest Base Camp via Namche Bazaar, Tengboche monastery and Kala Patthar at 5,545m for sunrise on the south face. Teahouse lodging, two acclimatisation days built in.",
    cover_image: img("photo-1544735716-392fe2489ffa", "seed/packages/ebc-cover"),
    images: [
      img("photo-1486911278844-a81c5267e227", "seed/packages/ebc-1"),
      img("photo-1434596922112-19c563067271", "seed/packages/ebc-2"),
      img("photo-1519904981063-b0cf448d479e", "seed/packages/ebc-3"),
    ],
    start_date: days_from_now(21),
    end_date: days_from_now(35),
    total_seats: 14,
    price: 145000,
    cost_type: package_cost_type.PER_PERSON,
    destinations: [
      { location: "Lukla", time: "Day 1" },
      { location: "Namche Bazaar", time: "Day 3" },
      { location: "Tengboche", time: "Day 5" },
      { location: "Dingboche", time: "Day 7" },
      { location: "Everest Base Camp", time: "Day 10" },
      { location: "Kala Patthar", time: "Day 11" },
    ],
  },
  {
    name: "Annapurna Circuit Trek",
    category: "Trekking",
    description:
      "The classic circuit from Besisahar round to Jomsom, crossing Thorong La at 5,416m. Rhododendron forest, the Manang valley and the Kali Gandaki gorge in a single route.",
    cover_image: img("photo-1585938389612-a552a28d6914", "seed/packages/annapurna-cover"),
    images: [
      img("photo-1503614472-8c93d56e92ce", "seed/packages/annapurna-1"),
      img("photo-1464822759023-fed622ff2c3b", "seed/packages/annapurna-2"),
      img("photo-1506197603052-3cc9c3a201bd", "seed/packages/annapurna-3"),
    ],
    start_date: days_from_now(30),
    end_date: days_from_now(46),
    total_seats: 16,
    price: 128000,
    cost_type: package_cost_type.PER_PERSON,
    destinations: [
      { location: "Besisahar", time: "Day 1" },
      { location: "Chame", time: "Day 3" },
      { location: "Manang", time: "Day 6" },
      { location: "Thorong La Pass", time: "Day 9" },
      { location: "Muktinath", time: "Day 10" },
      { location: "Jomsom", time: "Day 12" },
    ],
  },
  {
    name: "Langtang Valley Short Trek",
    category: "Trekking",
    description:
      "A seven day valley walk north of Kathmandu through Tamang villages rebuilt after the 2015 earthquake, finishing at the Kyanjin Ri viewpoint above the glacier.",
    cover_image: img("photo-1501555088652-021faa106b9b", "seed/packages/langtang-cover"),
    images: [
      img("photo-1472791108553-c9405341e398", "seed/packages/langtang-1"),
      img("photo-1506905925346-21bda4d32df4", "seed/packages/langtang-2"),
    ],
    start_date: days_from_now(12),
    end_date: days_from_now(19),
    total_seats: 12,
    price: 62000,
    cost_type: package_cost_type.PER_PERSON,
    destinations: [
      { location: "Syabrubesi", time: "Day 1" },
      { location: "Lama Hotel", time: "Day 2" },
      { location: "Langtang Village", time: "Day 3" },
      { location: "Kyanjin Gompa", time: "Day 4" },
    ],
  },
  {
    name: "Island Peak Climbing Expedition",
    category: "Mountain Expedition",
    description:
      "A guided ascent of Imja Tse at 6,189m, approached through the Khumbu. Includes two days of fixed rope and crampon training at Chhukung before the summit push.",
    cover_image: img("photo-1454496522488-7a8e488e8606", "seed/packages/island-cover"),
    images: [
      img("photo-1516655855035-d5215bcb5604", "seed/packages/island-1"),
      img("photo-1467579424161-6bbf270d9d7b", "seed/packages/island-2"),
    ],
    start_date: days_from_now(45),
    end_date: days_from_now(63),
    total_seats: 8,
    price: 310000,
    cost_type: package_cost_type.PER_PERSON,
    destinations: [
      { location: "Lukla", time: "Day 1" },
      { location: "Chhukung", time: "Day 7" },
      { location: "Island Peak Base Camp", time: "Day 9" },
      { location: "Summit 6,189m", time: "Day 11" },
    ],
  },
  {
    name: "Mera Peak Expedition",
    category: "Mountain Expedition",
    description:
      "Nepal's highest trekking peak at 6,476m, reached through the remote Hinku valley. Non-technical on the summit slope but a serious altitude objective requiring full acclimatisation.",
    cover_image: img("photo-1519681393784-d120267933ba", "seed/packages/mera-cover"),
    images: [
      img("photo-1486911278844-a81c5267e227", "seed/packages/mera-1"),
      img("photo-1491555103944-7c647fd857e6", "seed/packages/mera-2"),
    ],
    start_date: days_from_now(60),
    end_date: days_from_now(78),
    total_seats: 10,
    price: 285000,
    cost_type: package_cost_type.PER_PERSON,
    destinations: [
      { location: "Paiya", time: "Day 2" },
      { location: "Kothe", time: "Day 5" },
      { location: "Khare", time: "Day 7" },
      { location: "Mera High Camp", time: "Day 10" },
      { location: "Summit 6,476m", time: "Day 11" },
    ],
  },
  {
    name: "Kathmandu Heritage Walk",
    category: "Cultural Tour",
    description:
      "Three days across the valley's seven UNESCO sites, with a local historian guiding Patan and Bhaktapur durbar squares, Swayambhunath and the Boudhanath kora at dusk.",
    cover_image: img("photo-1605640840605-14ac1855827b", "seed/packages/ktm-cover"),
    images: [
      img("photo-1558799401-1dcba79834c3", "seed/packages/ktm-1"),
      img("photo-1582510003544-4d00b7f74220", "seed/packages/ktm-2"),
    ],
    start_date: days_from_now(7),
    end_date: days_from_now(10),
    total_seats: 20,
    price: 9500,
    cost_type: package_cost_type.PER_DAY,
    destinations: [
      { location: "Kathmandu Durbar Square", time: "Day 1" },
      { location: "Swayambhunath", time: "Day 1" },
      { location: "Patan Durbar Square", time: "Day 2" },
      { location: "Bhaktapur", time: "Day 3" },
      { location: "Boudhanath", time: "Day 3" },
    ],
  },
  {
    name: "Upper Mustang Cultural Trek",
    category: "Cultural Tour",
    description:
      "A restricted-area journey into the old kingdom of Lo, walking the wind-carved Tibetan plateau to the walled capital Lo Manthang and its fifteenth century monasteries.",
    cover_image: img("photo-1526772662000-3f88f10405ff", "seed/packages/mustang-cover"),
    images: [
      img("photo-1533130061792-64b345e4a833", "seed/packages/mustang-1"),
      img("photo-1470770841072-f978cf4d019e", "seed/packages/mustang-2"),
    ],
    start_date: days_from_now(40),
    end_date: days_from_now(54),
    total_seats: 12,
    price: 198000,
    cost_type: package_cost_type.PER_PERSON,
    destinations: [
      { location: "Jomsom", time: "Day 1" },
      { location: "Kagbeni", time: "Day 2" },
      { location: "Ghami", time: "Day 5" },
      { location: "Lo Manthang", time: "Day 7" },
    ],
  },
  {
    name: "Chitwan Jungle Safari",
    category: "Wildlife Safari",
    description:
      "Four days in Chitwan National Park with jeep drives, a dugout canoe run on the Rapti river, the elephant breeding centre and a Tharu stick dance evening in the village.",
    cover_image: img("photo-1549366021-9f761d450615", "seed/packages/chitwan-cover"),
    images: [
      img("photo-1544985361-b420d7a77043", "seed/packages/chitwan-1"),
      img("photo-1557050543-4d5f4e07ef46", "seed/packages/chitwan-2"),
    ],
    start_date: days_from_now(14),
    end_date: days_from_now(18),
    total_seats: 18,
    price: 11500,
    cost_type: package_cost_type.PER_DAY,
    destinations: [
      { location: "Sauraha", time: "Day 1" },
      { location: "Rapti River Canoe", time: "Day 2" },
      { location: "Elephant Breeding Centre", time: "Day 3" },
      { location: "Tharu Village", time: "Day 3" },
    ],
  },
  {
    name: "Bardia Tiger Tracking",
    category: "Wildlife Safari",
    description:
      "Six days in Nepal's quietest big park, on foot with naturalists tracking Bengal tiger and wild elephant along the Karnali floodplain. Small groups only, limited to six guests.",
    cover_image: img("photo-1561731216-c3a4d99437d5", "seed/packages/bardia-cover"),
    images: [
      img("photo-1547970810-dc1eac37d174", "seed/packages/bardia-1"),
      img("photo-1534567110243-8875d64ca8ff", "seed/packages/bardia-2"),
    ],
    start_date: days_from_now(25),
    end_date: days_from_now(31),
    total_seats: 6,
    price: 14000,
    cost_type: package_cost_type.PER_DAY,
    destinations: [
      { location: "Thakurdwara", time: "Day 1" },
      { location: "Karnali Floodplain", time: "Day 3" },
      { location: "Babai Valley", time: "Day 5" },
    ],
  },
  {
    name: "Pokhara Adventure Week",
    category: "Adventure Sports",
    description:
      "Five days built around the lake city: tandem paragliding off Sarangkot, two days rafting the Seti, a canyoning descent and a sunrise flight over the Annapurna range.",
    cover_image: img("photo-1530866495561-507c9faab2ed", "seed/packages/pokhara-cover"),
    images: [
      img("photo-1544551763-46a013bb70d5", "seed/packages/pokhara-1"),
      img("photo-1502680390469-be75c86b636f", "seed/packages/pokhara-2"),
    ],
    start_date: days_from_now(10),
    end_date: days_from_now(15),
    total_seats: 15,
    price: 13500,
    cost_type: package_cost_type.PER_DAY,
    destinations: [
      { location: "Sarangkot", time: "Day 1" },
      { location: "Seti River", time: "Day 2" },
      { location: "Phewa Lake", time: "Day 4" },
    ],
  },
  {
    name: "Muktinath Pilgrimage Tour",
    category: "Pilgrimage",
    description:
      "Six days to the Muktinath temple at 3,710m, sacred to both Hindus and Buddhists, driving the Kali Gandaki road with overnight stops at Pokhara and Jomsom.",
    cover_image: img("photo-1544735716-392fe2489ffa", "seed/packages/muktinath-cover"),
    images: [
      img("photo-1571536802807-30451e3955d8", "seed/packages/muktinath-1"),
      img("photo-1555921015-5532091f6026", "seed/packages/muktinath-2"),
    ],
    start_date: days_from_now(18),
    end_date: days_from_now(24),
    total_seats: 24,
    price: 48000,
    cost_type: package_cost_type.PER_PERSON,
    destinations: [
      { location: "Pokhara", time: "Day 1" },
      { location: "Jomsom", time: "Day 3" },
      { location: "Muktinath Temple", time: "Day 4" },
    ],
  },
  {
    name: "Lumbini and Buddhist Circuit",
    category: "Pilgrimage",
    description:
      "Four days at the birthplace of the Buddha and the surrounding Kapilvastu ruins, including the Maya Devi temple, the monastic zone and a dawn meditation session.",
    cover_image: img("photo-1528181304800-259b08848526", "seed/packages/lumbini-cover"),
    images: [
      img("photo-1545126178-003a0e4b1ba0", "seed/packages/lumbini-1"),
      img("photo-1512453979798-5ea266f8880c", "seed/packages/lumbini-2"),
    ],
    start_date: days_from_now(16),
    end_date: days_from_now(20),
    total_seats: 30,
    price: 32000,
    cost_type: package_cost_type.PER_PERSON,
    destinations: [
      { location: "Maya Devi Temple", time: "Day 1" },
      { location: "Monastic Zone", time: "Day 2" },
      { location: "Kapilvastu", time: "Day 3" },
    ],
  },
];


const site_content = {
  key: "site",
  brand: "Tour Management",
  logo: {
    path: "/logo-full.png",
    light_path: "/logo-light.png",
    mark_path: "/logo-mark.png",
  },
  hero: {
    badge: "Licensed operator, Kathmandu",
    title: "Plan Your Next Tour",
    subtitle: "Teahouse treks, Himalayan expeditions and lowland safaris, run out of Kathmandu.",
    cta_label: "Explore Packages",
    cta_link: "/packages",
    secondary_cta_label: "Who we are",
    secondary_cta_link: "/about-us",
    cover_image: img("photo-1544735716-392fe2489ffa", "seed/content/hero"),
  },
  trust_points: [
    {
      icon: "verified",
      title: "Licensed guides",
      description:
        "Every guide and porter is licensed, insured and paid above the NMA floor.",
    },
    {
      icon: "groups",
      title: "Small groups",
      description: "Expeditions cap at ten climbers. Tiger tracking caps at six.",
    },
    {
      icon: "route",
      title: "All permits included",
      description:
        "Permits, lodging and the support team are in the price you see.",
    },
    {
      icon: "support",
      title: "Talk to a human",
      description: "A member of our own team is on every departure we run.",
    },
  ],
  sections: {
    popular_packages: {
      title: "Popular packages",
      subtitle: "The departures filling up fastest this season.",
    },
    categories: {
      title: "Browse by category",
      subtitle: "Pick the kind of trip first, then the route.",
    },
    about_categories: {
      title: "What we run",
      subtitle: "Six kinds of trip, each with its own season and pace.",
    },
  },
  auth: {
    heading: "Treks, expeditions and safaris across Nepal.",
    body:
      "Small groups, licensed guides, permits included. Reserve your seat in a couple of minutes.",
    footnote: "Licensed operator, Kathmandu",
  },
  about: {
    title: "About Us",
    subtitle:
      "A Kathmandu based tour operator running treks, expeditions and safaris across Nepal.",
    paragraphs: [
      "We started in Thamel with a single teahouse trek and a borrowed van. Today we run routes across the Khumbu, the Annapurna range, Mustang and the lowland parks, and we still send a member of our own team on every departure.",
      "Group sizes stay small on purpose. An expedition never leaves with more than ten climbers, and our tiger tracking trips in Bardia cap at six. That costs us bookings and it is the reason our guides can still read the ground in front of them.",
      "Every guide and porter on our roster is licensed, insured and paid above the Nepal Mountaineering Association floor. Rates on a package page include permits, lodging and the support team. What is excluded is listed on the package itself, never buried.",
    ],
    highlights: [
      { icon: "packages", value: "", label: "Active packages" },
      { icon: "categories", value: "", label: "Trip categories" },
      { icon: "verified", value: "Govt. licensed", label: "Guides and porters" },
    ],
  },
  contact: {
    title: "Contact Us",
    subtitle:
      "Questions about a route, a date or a group booking? Send us a message.",
    address: "Thamel Marg, Kathmandu 44600, Nepal",
    phone: "+977 9865374070",
    email: "hello@tourmgmt.com",
    office_hours: "Sunday to Friday, 9:00 to 18:00 NPT",
    map_url: "https://maps.google.com/?q=Thamel,Kathmandu",
    form_title: "Send us a message",
    form_subtitle: "We reply within one working day.",
  },
  footer: {
    tagline: "Licensed trekking and expedition operator, Kathmandu, Nepal.",
    socials: [
      { label: "Facebook", url: "https://facebook.com" },
      { label: "Instagram", url: "https://instagram.com" },
      { label: "YouTube", url: "https://youtube.com" },
    ],
    copyright: "(c) 2026 Tour Management Pvt. Ltd. All rights reserved.",
  },
};

const users = [
  {
    first_name: "Bibek",
    last_name: "Shah",
    email: "admin@tourmgmt.com",
    password: "Admin@123",
    phone: "9865374070",
    role: Role.ADMIN,
    gender: Gender.MALE,
  },
  {
    first_name: "Sita",
    last_name: "Gurung",
    email: "user@tourmgmt.com",
    password: "User@123",
    phone: "9812345678",
    role: Role.USER,
    gender: Gender.FEMALE,
  },
];

const run = async () => {
  await mongoose.connect(process.env.DB_URI, { dbName: process.env.DB_NAME });
  console.log(`connected to ${mongoose.connection.name}`);

  // categories — upsert by name so a re-run does not duplicate
  const category_ids = {};
  for (const c of categories) {
    const doc = await Category.findOneAndUpdate(
      { name: c.name },
      { $set: c },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    category_ids[c.name] = doc._id;
  }
  console.log(`categories: ${Object.keys(category_ids).length}`);

  // packages — upsert by name, seats_available only initialised on insert
  // so a re-run never wipes seats already taken by real bookings
  let created = 0;
  for (const p of packages) {
    const { category, ...rest } = p;
    const res = await Tour_package.updateOne(
      { name: p.name },
      {
        $set: { ...rest, category: category_ids[category] },
        $setOnInsert: { seats_available: p.total_seats },
      },
      { upsert: true }
    );
    if (res.upsertedCount) created += 1;
  }
  console.log(`packages: ${packages.length} total, ${created} newly created`);

  // users — never overwrite an existing account's password
  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`user ${u.email} already exists, left untouched`);
      continue;
    }
    await User.create({ ...u, password: await hash_password(u.password) });
    console.log(`user ${u.email} created (password: ${u.password})`);
  }

  // site content — one singleton doc the public pages read from
  await Content.findOneAndUpdate(
    { key: site_content.key },
    { $set: site_content },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("site content: upserted");

  await mongoose.disconnect();
  console.log("seed complete");
};

run().catch(async (e) => {
  console.error("seed failed:", e.message);
  await mongoose.disconnect();
  process.exit(1);
});
