import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHmac, timingSafeEqual } from "crypto";

const createOrderInput = z.object({
  amount: z.number().int().positive(), // in paise
  receipt: z.string().max(40),
  notes: z.record(z.string()).optional(),
});

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createOrderInput.parse(data))
  .handler(async ({ data }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay is not configured. Missing RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET.");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: "INR",
        receipt: data.receipt,
        notes: data.notes ?? {},
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Razorpay create order failed [${res.status}]: ${body}`);
      throw new Error(`Could not create order (${res.status})`);
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };
    return { orderId: order.id, amount: order.amount, currency: order.currency, keyId };
  });

const verifyInput = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => verifyInput.parse(data))
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay is not configured.");

    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(data.razorpaySignature);
    const valid = a.length === b.length && timingSafeEqual(a, b);
    if (!valid) throw new Error("Invalid payment signature");
    return { verified: true as const };
  });
