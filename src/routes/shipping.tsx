import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns - welded" },
      { name: "description", content: "Shipping timelines and return policy for welded orders." },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16 md:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Support</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Shipping & Returns</h1>

      {/* SHIPPING */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">Shipping</h2>
        <div className="mt-6 space-y-6 text-muted-foreground">
          <p>We ship across India. Orders are packed and handed to our courier partner within 24–48 hours of confirmation.</p>
          <p>Once shipped, you'll get a tracking link by email - you can also track your order anytime on our <Link to="/track" className="font-semibold text-foreground underline underline-offset-4">order tracking page</Link>.</p>
          <p>Delivery usually takes 4–7 business days depending on your location.</p>
        </div>
      </section>

      {/* RETURNS */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="font-display text-2xl font-bold">Returns & Refunds</h2>
        <div className="mt-6 space-y-6 text-muted-foreground">
          <p>
            Returns are accepted only for items that arrive <span className="font-semibold text-foreground">damaged or defective</span>.
            We don't offer returns or exchanges for change of mind, sizing, or preference.
          </p>
          <p>
            To be eligible, you must record a clear, unedited unboxing video - starting from the sealed
            package - showing the damage or defect. This video is required for every claim; without it,
            we won't be able to process a return or refund.
          </p>
          <p>
            Claims must be raised within 48 hours of delivery. Once approved, refunds are processed to
            your original payment method within 7–10 business days.
          </p>
          <p>
            To start a claim, use our <Link to="/contact" className="font-semibold text-foreground underline underline-offset-4">contact page</Link> and
            share your order details along with the unboxing video.
          </p>
        </div>
      </section>
    </div>
  );
}