import Hero from "@/assets/4.png";
import chrome1 from "@/assets/1.png";
import chrome2 from "@/assets/2.png";
import chrome3 from "@/assets/3.png";
import chrome4 from "@/assets/7.png";
import chrome5 from "@/assets/micro.png";
import chrome6 from "@/assets/real_shots.png";

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
    id: "chromepro-earphones(type-c)",
    name: "ChromePro Earphones (Type-C)",
    tagline: "Mirror-finish sound. Molded to move.",
    images: [Hero, chrome1, chrome2, chrome3, chrome4, chrome5, chrome6],
    mrp: 1299,
    tiers: [
      { qty: 1, price: 599, label: "Buy 1" },
      { qty: 2, price: 1099, label: "Buy 2 — Save more" },
    ],
    rating: 4.3,
    reviewsCount: 84,
    description:
      "Chromepro is our flagship Type-C wired earphone - an electroplated mirror-chrome shell wrapped around a 14.2mm dynamic driver, hand-tuned across 200+ passes for deep bass and clear vocals. Plugs straight into any Type-C device, no pairing, no charging, zero latency. IPX5 sweat & splash resistant, built on a durable TPE cable that's made to move with you.",
    highlights: [
      "14.2mm dynamic driver, hand-tuned across 200+ passes",
      "Type-C wired -direct plug, zero latency, zero charging",
      "106±3dB sensitivity · ≤0.5% distortion · 20Hz–20kHz",
      "Electroplated mirror-chrome shell on a 1m TPE cable",
    ],
    specs: {
      Driver: "14.2mm dynamic",
      Connector: "Type-C, wired",
      "Cable Length": "1m",
      "Frequency Response": "20Hz – 20kHz",
      Sensitivity: "106±3dB",
      Impedance: "32Ω",
      Distortion: "≤0.5%",
      "Weight": "50g",
      "Color": "Chrome",
      "Model": "WD-CPRO-TC",
    },
    inBox: [
  "7-Day Return Policy",
  "Easy Refund or Replacement",
  "Hassle-Free Customer Support",
],
    reviews: [
      { name: "karan ", rating: 5, date: "12 Jun 2026", title: "Better than my AirPods.", body: "The chrome finish looks unreal, and the bass is punchy without muddying vocals. Call quality on the metro is genuinely impressive." },
      { name: "aakash ", rating: 5, date: "04 Jun 2026", title: "Insane value at this price.", body: "Lasts my entire work day + gym. Fit is snug and it actually works for BGMI." },
      { name: "Megha ", rating: 4, date: "28 May 2026", title: "Loving the design.", body: "Only wish they had ANC. Otherwise a 10/10 buy, especially with the Buy 2 combo." },
      { name: "Iyaapan ", rating: 5, date: "19 May 2026", title: "Gift-worthy packaging.", body: "Unboxing felt like an premium product. Sound is crisp, mids are warm. Highly recommend." },
    ],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);