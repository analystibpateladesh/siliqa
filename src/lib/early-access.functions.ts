import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  email: z.string().trim().email().max(255),
});

export const submitEarlyAccess = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.APPS_SCRIPT_EARLY_ACCESS_URL;
    if (!url) {
      console.warn("[siliqa] APPS_SCRIPT_EARLY_ACCESS_URL not set. Skipping.");
      return { ok: false, skipped: true as const };
    }

    const payload = {
      type: "early_access",
      email: data.email,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error(`Apps Script early-access failed [${res.status}]: ${body}`);
        throw new Error("Could not save email. Please try again.");
      }
      return { ok: true as const };
    } catch (e) {
      console.error("Early access submit failed", e);
      throw new Error("Could not save email. Please try again.");
    }
  });
