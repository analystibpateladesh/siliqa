// Runtime config — replace via .env / secrets when live.
export const RAZORPAY_KEY_ID =
  (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ?? "";
export const APPS_SCRIPT_ORDERS_URL =
  (import.meta.env.VITE_APPS_SCRIPT_ORDERS_URL as string | undefined) ?? "https://script.google.com/macros/s/AKfycby-poB2eg_UtplyoOfkXEM229lBDs0axRztrwibDQaMr-htj-Gc5voxRCZDjvRiwDAt/exec";
export const APPS_SCRIPT_CONTACT_URL =
  (import.meta.env.VITE_APPS_SCRIPT_CONTACT_URL as string | undefined) ?? "";

export const BRAND = {
  name: "siliqa",
  tagline: "The Element of Everything",
  sub: "Where Innovation Begins.",
  email: "supportsiliqa@gmail.com",
  phone: "+91 9140579643",
  address: "India",
};
