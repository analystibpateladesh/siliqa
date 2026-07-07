import chromeHero from "@/assets/chrome-hero.jpg";
import chrome1 from "@/assets/chrome-1.jpg";
import chrome2 from "@/assets/chrome-2.jpg";
import chrome3 from "@/assets/chrome-3.jpg";

export type PricingTier = { qty: number; price: number; label: string };

export type Product = {
  id: string;
  name: string;
  tagline: string;
  images: string[];
  mrp: number;
  tiers: PricingTier[]; // pricing per buy option
  rating: number;
  reviewsCount: number;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  inBox: string[];
  reviews: { name: string; rating: number; date: string; title: string; body: string }[];
};

export const PRODUCTS: Product[] = [
  {
    id: "chromepro-earphones",
    name: "Chromepro Earphones",
    tagline: "Mirror-finish sound. Molded to move.",
    images: [chromeHero, chrome1, chrome2, chrome3],
    mrp: 1299,
    tiers: [
      { qty: 1, price: 599, label: "Buy 1" },
      { qty: 2, price: 1099, label: "Buy 2 — Save more" },
    ],
    rating: 4.7,
    reviewsCount: 1284,
    description:
      "Chromepro is our flagship wireless earbud — a mirror-polished shell wrapped around a 13mm dynamic driver tuned by our in-house acoustics team. Adaptive ENC blocks ambient noise on calls, and low-latency mode drops audio delay under 60ms for gaming. IPX5 sweat resistance, up to 40 hours of playback with the case, and touch controls that just make sense.",
    highlights: [
      "13mm titanium-coated dynamic driver",
      "Adaptive ENC dual-mic call clarity",
      "Bluetooth 5.3 · 60ms low-latency mode",
      "40hr total playback · 10min = 2hr fast charge",
      "IPX5 sweat & splash resistant",
    ],
    specs: {
      Driver: "13mm titanium-coated dynamic",
      Bluetooth: "5.3, dual-device pairing",
      Codec: "SBC / AAC",
      "Battery (buds)": "40 mAh · up to 8 hrs",
      "Battery (case)": "400 mAh · 40 hrs total",
      "Charging": "USB-C · 10 min = 2 hrs",
      "Water Resistance": "IPX5",
      "Weight": "4.2g per bud · 38g case",
      "Warranty": "12 months",
    },
    inBox: ["Chromepro earbuds", "Charging case", "USB-C cable", "3 pairs silicone tips (S/M/L)", "User guide"],
    reviews: [
      { name: "Aarav S.", rating: 5, date: "12 Jun 2026", title: "Better than my AirPods.", body: "The chrome finish looks unreal, and the bass is punchy without muddying vocals. Call quality on the metro is genuinely impressive." },
      { name: "Priya M.", rating: 5, date: "04 Jun 2026", title: "Insane value at this price.", body: "Battery lasts my entire work day + gym. Fit is snug and the low-latency mode actually works for BGMI." },
      { name: "Kabir V.", rating: 4, date: "28 May 2026", title: "Loving the design.", body: "Only wish they had ANC. Otherwise a 10/10 buy, especially with the Buy 2 combo." },
      { name: "Neha R.", rating: 5, date: "19 May 2026", title: "Gift-worthy packaging.", body: "Unboxing felt like an Apple product. Sound is crisp, mids are warm. Highly recommend." },
    ],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
