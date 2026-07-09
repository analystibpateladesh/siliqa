// Runtime config — replace via .env / secrets when live.
export const RAZORPAY_KEY_ID =
  (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ?? "";
export const APPS_SCRIPT_ORDERS_URL =
  (import.meta.env.VITE_APPS_SCRIPT_ORDERS_URL as string | undefined) ?? "https://script.google.com/macros/s/AKfycbxvGWt7ARJT-LLLi6yP3t2H65aUS5brcOuX2CMY5MA5Y-SovGOqzQpaefiyHlmxT-_j/exec";
export const APPS_SCRIPT_CONTACT_URL =
  (import.meta.env.VITE_APPS_SCRIPT_CONTACT_URL as string | undefined) ?? "";

export const BRAND = {
  name: "welded",
  tagline: "Where Technology Meets Luxury",
  sub: "Where Innovation Begins.",
  email: "info.welded@gmail.com",
  phone: "+91 9140579643",
  address: "India",
};
