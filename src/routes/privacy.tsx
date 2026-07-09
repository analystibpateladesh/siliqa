import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — welded" },
      { name: "description", content: "How welded collects, uses, and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    t: "Information we collect",
    d: "When you place an order, we collect your name, address, phone number, email, and payment details. Payment is processed securely by Razorpay — we never see or store your card or UPI details.",
  },
  {
    t: "How we use it",
    d: "Your information is used to process orders, ship products, send order updates, and offer support. We don't sell or rent your data to third parties.",
  },
  {
    t: "Cookies",
    d: "We use basic cookies to keep your cart and preferences working smoothly across visits. No third-party ad tracking.",
  },
  {
    t: "Data sharing",
    d: "We share only what's necessary with our shipping partner (Shiprocket) to deliver your order, and with Razorpay to process payment.",
  },
  {
    t: "Data security",
    d: "Your data is stored securely and access is limited to what's needed to run welded. We take reasonable steps to protect it from unauthorised access.",
  },
  {
    t: "Your rights",
    d: "You can request a copy of your data or ask us to delete it at any time by reaching out through our support page.",
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16 md:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Legal</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: July 2026</p>

      <p className="mt-8 text-muted-foreground">
        welded ("we", "us") respects your privacy. This page explains what we collect and how it's used
        — kept short, on purpose.
      </p>

      <div className="mt-12 divide-y divide-border">
        {SECTIONS.map((s, i) => (
          <div key={i} className="py-8 first:pt-0">
            <h2 className="font-display text-xl font-bold">{s.t}</h2>
            <p className="mt-3 text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
