/**
 * Every string and number on the page comes from here.
 * All of it is taken from the live GB Tyre Services site, not invented.
 */

export const business = {
  name: "GB Tyre Services",
  since: 2015,
  street: "24b Pennywell Rd",
  city: "Edinburgh",
  postcode: "EH4 4HD",
  phone: "0131 516 0030",
  phoneHref: "tel:+441315160030",
  mobile: "07472 131756",
  whatsapp: "447472131756",
  email: "info@gbtyreservices.co.uk",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=24b+Pennywell+Rd,+Edinburgh+EH4+4HD",
} as const;

export const fullAddress = `${business.street}, ${business.city} ${business.postcode}`;

/** Booking link with the message already written. */
export function whatsappLink(message: string) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const openingHours = [
  { days: "Monday to Friday", opens: "9:00", closes: "18:00" },
  { days: "Saturday", opens: "9:00", closes: "15:00" },
  { days: "Sunday", opens: null, closes: null },
] as const;

/** Weekday index (0 = Sunday) to opening window in local hours. */
export const hoursByDay: Record<number, { open: number; close: number } | null> =
  {
    0: null,
    1: { open: 9, close: 18 },
    2: { open: 9, close: 18 },
    3: { open: 9, close: 18 },
    4: { open: 9, close: 18 },
    5: { open: 9, close: 18 },
    6: { open: 9, close: 15 },
  };

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  detail: string;
  photo: string;
  cta: string;
  message: string;
};

export const services: Service[] = [
  {
    slug: "new-tyres",
    title: "New tyre fitting",
    blurb:
      "A huge range of premium and budget tyres, fitted fast and balanced to spec.",
    detail:
      "Cars, vans and 4x4 in every common size. We price match, so bring the quote you found elsewhere.",
    photo: "/img/svc-new-tyres.jpg",
    cta: "Book tyre fitting",
    message:
      "Hi GB Tyre Services, I need new tyres fitted. My tyre size is ",
  },
  {
    slug: "puncture-repair",
    title: "Puncture repair",
    blurb:
      "Safe, permanent repairs. Most drivers are back on the road inside half an hour.",
    detail:
      "We inspect the casing first. If the damage sits outside the repairable area we will tell you straight, not sell you a patch that will not hold.",
    photo: "/img/svc-puncture.jpg",
    cta: "Book a repair",
    message: "Hi GB Tyre Services, I have a puncture and need it repaired.",
  },
  {
    slug: "wheel-balancing",
    title: "Wheel balancing",
    blurb:
      "Kills the steering wobble, evens out tyre wear and gives you back fuel economy.",
    detail:
      "Balanced on modern equipment at road speed. Worth doing any time a tyre comes off the rim.",
    photo: "/img/svc-balancing.jpg",
    cta: "Book balancing",
    message: "Hi GB Tyre Services, I would like my wheels balanced.",
  },
  {
    slug: "tpms",
    title: "TPMS service",
    blurb:
      "Sensor diagnosis, valve service and reset so the dashboard light goes out and stays out.",
    detail:
      "Pressure sensors fail with age and corrosion. We test, replace and re-register them to your car.",
    photo: "/img/svc-tpms.jpg",
    cta: "Book TPMS service",
    message: "Hi GB Tyre Services, my TPMS warning light is on.",
  },
  {
    slug: "tyre-check",
    title: "Free tyre check",
    blurb:
      "Tread depth, pressures and a look at the sidewalls. No charge, no appointment.",
    detail:
      "Drop in during opening hours. If everything is legal and safe we will say so and send you on your way.",
    photo: "/img/svc-check.jpg",
    cta: "Drop in for a check",
    message: "Hi GB Tyre Services, I would like a free tyre check.",
  },
];

export const brands = [
  "Michelin",
  "Pirelli",
  "Goodyear",
  "Bridgestone",
  "Continental",
  "Dunlop",
  "Falken",
  "Avon",
];

/** Six proof points, sized for the bento grid. */
export const reasons = [
  {
    label: "Turnaround",
    stat: "30-60",
    title: "Minutes for most jobs",
    description: "Fitting, repairs and balancing are same-day work.",
  },
  {
    label: "Opening",
    stat: "6",
    title: "Days a week",
    description: "Monday to Friday until six, Saturday until three.",
  },
  {
    label: "Reviews",
    stat: "5.0",
    title: "Rated by Edinburgh drivers",
    description:
      "Ten years on Pennywell Road, mostly on repeat custom and word of mouth. Walk in and you will usually be seen the same hour.",
  },
  {
    label: "Booking",
    stat: "Same day",
    title: "Walk in or book ahead",
    description:
      "Send your registration or tyre size on WhatsApp and we will have the tyre off the rack before you arrive.",
  },
  {
    label: "Price",
    stat: "Matched",
    title: "Bring us the quote",
    description: "Find it cheaper locally and we will meet the price.",
  },
  {
    label: "Free",
    stat: "£0",
    title: "Tread and pressure check",
    description: "No charge, no appointment, no upsell if it is all legal.",
  },
];

export const testimonials = [
  {
    quote:
      "Great local tyre shop. Replaced two tyres quickly and at a fair price. Will definitely return.",
    name: "James Robertson",
    place: "Edinburgh",
  },
  {
    quote:
      "Fixed my puncture in 20 minutes. Friendly staff and very professional. Highly recommend.",
    name: "Nadia Khan",
    place: "Muirhouse",
  },
  {
    quote:
      "Got my wheel done here and the car drives like new. Best prices in town.",
    name: "Callum Stewart",
    place: "Drylaw",
  },
];

export const areas = [
  "Edinburgh City Centre",
  "Leith",
  "Portobello",
  "Corstorphine",
  "Muirhouse",
  "Drylaw",
  "Musselburgh",
  "Dalkeith",
  "Livingston",
  "South Queensferry",
];

/** Sizes commonly seen on the sidewall, used by the size picker. */
export const sizeOptions = {
  width: [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275],
  profile: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
  rim: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Your tyre size", href: "#size" },
  { label: "Why us", href: "#why" },
  { label: "Areas", href: "#areas" },
  { label: "Contact", href: "#contact" },
];
