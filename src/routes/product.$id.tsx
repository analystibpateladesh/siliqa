import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Star, Check, Minus, Plus, ShieldCheck, Truck, RotateCcw, ChevronDown } from "lucide-react";
import { getProduct } from "@/lib/products";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    return {
      meta: [
        { title: p ? `${p.name} :welded` : "Product: welded" },
        { name: "description", content: p?.description.slice(0, 155) ?? "Premium electronics from welded." },
        { property: "og:title", content: p ? `${p.name} -welded` : "welded" },
        { property: "og:description", content: p?.tagline ?? "" },
        ...(p ? [{ property: "og:image", content: p.images[0] }] : []),
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-sm underline">Back to shop</Link>
    </div>
  ),
});

function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const product = getProduct(id);
  const navigate = useNavigate();
  const addItem = useCart((s) => s.addItem);

  const [tierIdx, setTierIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [open, setOpen] = useState<string | null>("description");

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm underline">Back to shop</Link>
      </div>
    );
  }

  const tier = product.tiers[tierIdx];
  const off = Math.round((1 - tier.price / (product.mrp * tier.qty)) * 100);

  const toCartItem = () => ({
    productId: product.id,
    name: product.name,
    image: product.images[0],
    unitPrice: tier.price,
    qty: tier.qty,
    tierLabel: tier.label,
  });

  const addToCart = () => {
    addItem(toCartItem());
    toast.success("Added to cart", { description: `${tier.label} · ₹${tier.price}` });
  };

  const buyNow = () => {
    addItem(toCartItem());
    navigate({ to: "/checkout" });
  };

  const sections = [
    {
      k: "description",
      title: "Product Description",
      body: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>{product.description}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {product.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      k: "specs",
      title: "Specifications",
      body: (
        <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {Object.entries(product.specs).map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-border py-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      k: "inbox",
      title: "7-Day Returns & Refund Policy",
      body: (
        <ul className="space-y-2 text-sm">
          {product.inBox.map((i, k) => (
            <li key={k} className="flex items-center gap-2">
              <Check className="h-4 w-4" /> {i}
            </li>
          ))}
        </ul>
      ),
    },
    {
      k: "reviews",
      title: `Customer Reviews (${product.reviewsCount.toLocaleString("en-IN")})`,
      body: (
        <div className="space-y-6">
          {product.reviews.map((r, i) => (
            <div key={i} className="border-b border-border pb-6 last:border-none">
              <div className="flex items-center gap-1">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                ))}
              </div>
              <h4 className="mt-2 font-semibold">{r.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              <p className="mt-2 text-xs text-muted-foreground">— {r.name}, {r.date}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> · <Link to="/shop" className="hover:text-foreground">Shop</Link> · <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl border border-border bg-secondary">
            <img
              src={product.images[imgIdx]}
              alt={product.name}
              width={1300}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((im, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`aspect-square overflow-hidden rounded-xl border ${
                  i === imgIdx ? "border-foreground" : "border-border"
                }`}
              >
                <img src={im} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">welded</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-muted-foreground">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
              ))}
            </div>
            <span className="text-muted-foreground">{product.rating}/5 · {product.reviewsCount.toLocaleString("en-IN")} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">₹{tier.price}</span>
            <span className="text-muted-foreground line-through">₹{product.mrp * tier.qty}</span>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
              {off}% OFF
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes · Free shipping</p>

          {/* Tier selector */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Select Pack Type</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {product.tiers.map((t, i) => {
                const selected = i === tierIdx;
                const total = product.mrp * t.qty;
                const save = total - t.price;
                return (
                  <button
                    key={i}
                    onClick={() => setTierIdx(i)}
                    className={`relative rounded-2xl border p-4 text-left transition-all ${
                      selected ? "border-foreground bg-accent" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t.label}</span>
                      {selected && <Check className="h-4 w-4" />}
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-xl font-bold">₹{t.price}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{total}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Save ₹{save}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={buyNow}
              className="flex-1 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Buy Now
            </button>
            <button
              onClick={addToCart}
              className="flex-1 rounded-full border border-border px-6 py-4 text-sm font-semibold hover:bg-accent"
            >
              Add to Cart
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
            {[
              { Ic: Truck, t: "Free shipping" },
              { Ic: ShieldCheck, t: "Premium Support" },
              { Ic: RotateCcw, t: "7-day returns" },
            ].map((x, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-xl border border-border p-3 text-center">
                <x.Ic className="h-4 w-4" />
                <span>{x.t}</span>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="mt-8 divide-y divide-border border-y border-border">
            {sections.map((s) => {
              const isOpen = open === s.k;
              return (
                <div key={s.k}>
                  <button
                    onClick={() => setOpen(isOpen ? null : s.k)}
                    className="flex w-full items-center justify-between py-4 text-left font-semibold"
                  >
                    <span>{s.title}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <div className="pb-6">{s.body}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
