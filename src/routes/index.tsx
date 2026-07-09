import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cable, Droplets, Waves, ShieldCheck, Star } from "lucide-react";
import heroImg from "@/assets/4.png";
import chrome1 from "@/assets/ad.png";
import chrome3 from "@/assets/chrome-ist.png";
import chrome4 from "@/assets/tech.png";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "welded — Chromepro Earphones · Type-C Wired Audio" },
      { name: "description", content: "Mirror-finish Type-C wired earphones. Meet Chromepro from welded — starting ₹599." },
      { property: "og:title", content: "welded — ChromePro Earphones" },
      { property: "og:description", content: "Where Technology Meets Luxury. Premium sound, mirror-polished, Type-C wired design." },
    ],
  }),
  component: HomePage,
});

const product = PRODUCTS[0];

function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-10 md:pt-16 pb-6 md:pb-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                New · ChromePro Series
              </p>
              <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
                Sound, <span className="text-chrome">reflected</span>.
              </h1>
              <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
                ChromePro earphones - electroplated mirror-chrome shell, Type-C wired,splash-proof. Built to move with you.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  Buy from ₹{product.tiers[0].price}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-accent"
                >
                  Shop all
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                  ))}
                </div>
                <span>{product.rating}/5 · {product.reviewsCount.toLocaleString("en-IN")} reviews</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-chrome opacity-20 blur-3xl rounded-full" />
              <img
                src={heroImg}
                alt="Chromepro chrome-finish wireless earphones"
                width={1600}
                height={1200}
                className="w-full rounded-3xl"
              />
            </div>
          </div>
        </div>

        {/* Marquee spec bar */}
        <div className="border-y border-border bg-secondary">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
            {[
              { k: "20-20Khz", v: "Frequency response" },
              { k: "14.2mm", v: "Dynamic driver" },
              { k: "0.5% ", v: "Low distortion" },
              { k: "106dB", v: "High sensitivity" },
            ].map((s) => (
              <div key={s.k} className="p-6 text-center">
                <div className="font-display text-3xl font-bold">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 1 */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 pt-0 pb-24">
        <div className="grid gap-0 md:grid-cols-2 md:items-center">
          <img
            src={chrome1}
            alt="Chromepro on black"
            width={1200}
            height={1200}
            loading="lazy"
            className="w-full rounded-3xl"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Acoustics
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Every frequency, on stage.
            </h2>
            <p className="mt-6 text-muted-foreground">
              A 14.2mm dynamic driver, hand-tuned across 200+ passes. Deep, controlled bass. Vocals that
              breathe. Highs that don't sting.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                { Icon: Waves, t: "Studio-grade tuning", d: "20Hz–20kHz response, 106±3dB sensitivity, ≤0.5% distortion." },
                { Icon: Cable, t: "Type-C wired", d: "Direct-plug 1m cord - zero latency, zero charging." },
                { Icon: ShieldCheck, t: "Mirror-chrome shell", d: "Electroplated finish over a durable TPE cable." },
              ].map((f, i) => (
                <li key={i} className="flex gap-4">
                  <f.Icon className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <div className="font-semibold">{f.t}</div>
                    <div className="text-muted-foreground">{f.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRODUCT CTA */}
      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 py-0 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground/60">
              Featured
            </p>
            <h2 className="mt-3 font-display text-5xl font-bold tracking-tight md:text-6xl">
              Chromepro Earphones.
            </h2>
            <p className="mt-6 max-w-xl text-primary-foreground/70">
              Our flagship. Mirror-polished shell. Sound engineered without compromise.
            </p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold">₹{product.tiers[0].price}</span>
              <span className="text-primary-foreground/50 line-through">₹{product.mrp}</span>
              <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                {Math.round((1 - product.tiers[0].price / product.mrp) * 100)}% OFF
              </span>
            </div>
            <Link
              to="/product/$id"
              params={{ id: product.id }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary hover:opacity-90"
            >
              Shop ChromePro <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <img
            src={chrome4}
            alt="ChromePro on white"
            width={1200}
            height={1200}
            loading="lazy"
            className="w-full rounded-3xl"
          />
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Loved by 0.2k+ customers
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              What people are saying.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
              ))}
            </div>
            <span>{product.rating}/5 average</span>
          </div>
        </div>
 
        <div className="mt-10 divide-y divide-border">
          {product.reviews.slice(0, 3).map((r, i) => (
            <div key={i} className="py-6 first:pt-0">
              <div className="flex items-center gap-1">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                ))}
              </div>
              <h3 className="mt-3 font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              <div className="mt-4 text-xs text-muted-foreground">
                {r.name} · {r.date}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
 