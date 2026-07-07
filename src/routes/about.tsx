import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/config";
import heroImg from "@/assets/chrome-hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — siliqa" },
      { name: "description", content: "siliqa builds premium electronics for people who care about the details. Learn our story." },
      { property: "og:title", content: "About — siliqa" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 md:px-8 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Our story</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
          {BRAND.tagline}.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {BRAND.name} is a young electronics startup obsessed with the details others overlook — from the click of a button
          to the finish of a shell. We build products that feel considered, from first unbox to daily use.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-16">
        <img src={heroImg} alt="Chromepro" width={1600} height={1200} className="w-full rounded-3xl" />
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-8 py-16 grid gap-12 md:grid-cols-3">
        {[
          { k: "01", t: "Made by listeners", d: "Every product is tuned by real audio engineers, not spec sheets." },
          { k: "02", t: "Zero compromise materials", d: "Titanium-coated drivers, mirror-polished shells, USB-C fast charge." },
          { k: "03", t: "Direct, honest pricing", d: "No middlemen. No markup theatre. Just the fair price." },
        ].map((v) => (
          <div key={v.k}>
            <div className="font-display text-5xl font-bold text-muted-foreground/40">{v.k}</div>
            <h3 className="mt-4 font-display text-2xl font-bold">{v.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-20 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Start with Chromepro.</h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
            Our flagship earphones — and the first product in a series we can't wait to show you.
          </p>
          <Link
            to="/product/$id"
            params={{ id: "chromepro-earphones" }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary hover:opacity-90"
          >
            Shop Chromepro <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
