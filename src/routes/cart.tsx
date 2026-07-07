import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart -siliqa" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something beautiful to get started.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-12">
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border border-y border-border">
          {items.map((it) => (
            <div key={it.productId} className="flex gap-4 py-5">
              <img src={it.image} alt={it.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{it.name}</h3>
                    <p className="text-xs text-muted-foreground">{it.tierLabel}</p>
                  </div>
                  <button onClick={() => removeItem(it.productId)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(it.productId, it.qty - 1)} className="grid h-8 w-8 place-items-center">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{it.qty}</span>
                    <button onClick={() => setQty(it.productId, it.qty + 1)} className="grid h-8 w-8 place-items-center">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="font-semibold">₹{(it.unitPrice * it.qty).toLocaleString("en-IN")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl font-bold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">FREE</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-lg font-bold">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Checkout
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">
            or continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
