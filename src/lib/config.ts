// Runtime config — replace via .env / secrets when live.
export const RAZORPAY_KEY_ID =
  (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ?? "";
export const APPS_SCRIPT_ORDERS_URL =
  (import.meta.env.VITE_APPS_SCRIPT_ORDERS_URL as string | undefined) ?? "";
export const APPS_SCRIPT_CONTACT_URL =
  (import.meta.env.VITE_APPS_SCRIPT_CONTACT_URL as string | undefined) ?? "";

export const BRAND = {
  name: "siliqa",
  tagline: "The Element of Everything",
  sub: "Where Innovation Begins.",
  email: "hello@siliqa.com",
  phone: "+91 00000 00000",
  address: "India",
};
