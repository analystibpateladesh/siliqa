import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — siliqa" },
      { name: "description", content: "Shop premium electronics from siliqa. Chromepro Earphones and more coming soon." },
      { property: "og:title", content: "Shop — siliqa" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Shop</p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight md:text-6xl">All Products</h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Every siliqa product, engineered without compromise. Free shipping across India.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">{PRODUCTS.length} product{PRODUCTS.length > 1 ? "s" : ""}</div>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => {
          const off = Math.round((1 - p.tiers[0].price / p.mrp) * 100);
          return (
            <Link
              key={p.id}
              to="/product/$id"
              params={{ id: p.id }}
              className="hover-lift group block overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  width={1200}
                  height={1200}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold">{p.name}</h3>
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {off}% OFF
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{p.tagline}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-foreground text-foreground" />
                  ))}
                  <span className="ml-1">{p.rating} ({p.reviewsCount.toLocaleString("en-IN")})</span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="font-display text-2xl font-bold">₹{p.tiers[0].price}</div>
                    <div className="text-xs text-muted-foreground line-through">₹{p.mrp}</div>
                  </div>
                  <div className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                    View <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
