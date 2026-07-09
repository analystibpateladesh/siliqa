import { APPS_SCRIPT_ORDERS_URL, APPS_SCRIPT_CONTACT_URL, BRAND } from "./config";
import type { SavedOrder } from "./store";

export function generateOrderId() {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString().slice(-6);
  return `WLD-${time}-${rnd}`;
}

export async function postToAppsScript(url: string, payload: Record<string, unknown>) {
  if (!url) {
    console.warn("[welded] Apps Script URL not configured. Skipping post.", payload);
    return { ok: false, skipped: true };
  }
  try {
    // no-cors avoids CORS pain from Apps Script deployments
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { ok: true };
  } catch (e) {
    console.error("Apps Script post failed", e);
    return { ok: false, error: String(e) };
  }
}

export const submitOrderToSheet = (order: SavedOrder) =>
  postToAppsScript(APPS_SCRIPT_ORDERS_URL, { type: "order", ...order });

export const submitContactToSheet = (data: Record<string, unknown>) =>
  postToAppsScript(APPS_SCRIPT_CONTACT_URL, { type: "contact", ...data });

let razorpayLoading: Promise<boolean> | null = null;
export function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);
  if (razorpayLoading) return razorpayLoading;
  razorpayLoading = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
  return razorpayLoading;
}

export type PayResult = {
  paymentId: string;
  razorpayOrderId: string;
  signature: string;
};

export async function openRazorpay(opts: {
  keyId: string;
  amount: number; // in paise (from server)
  razorpayOrderId: string;
  receiptId: string;
  customer: { name: string; email: string; phone: string };
}): Promise<PayResult> {
  const ok = await loadRazorpay();
  if (!ok) throw new Error("Failed to load Razorpay");
  return new Promise((resolve, reject) => {
    const rz = new (window as any).Razorpay({
      key: opts.keyId,
      order_id: opts.razorpayOrderId,
      amount: opts.amount,
      currency: "INR",
      name: BRAND.name,
      description: `Order ${opts.receiptId}`,
      prefill: {
        name: opts.customer.name,
        email: opts.customer.email,
        contact: opts.customer.phone,
      },
      theme: { color: "#000000" },
      handler: (resp: any) =>
        resolve({
          paymentId: resp.razorpay_payment_id,
          razorpayOrderId: resp.razorpay_order_id,
          signature: resp.razorpay_signature,
        }),
      modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
    });
    rz.open();
  });
}
