import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Search, CheckCircle2, Truck, Home } from "lucide-react";
import { useOrders, type SavedOrder } from "@/lib/store";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Order — siliqa" },
      { name: "description", content: "Track your siliqa order by ID." },
      { property: "og:title", content: "Track Order — siliqa" },
    ],
  }),
  component: TrackPage,
});

const STAGES = [
  { k: "confirmed", label: "Order Confirmed", Icon: CheckCircle2 },
  { k: "packed", label: "Packed", Icon: Package },
  { k: "shipped", label: "Shipped", Icon: Truck },
  { k: "delivered", label: "Delivered", Icon: Home },
] as const;

function TrackPage() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const getOrder = useOrders((s) => s.get);

  const search = () => {
    setErr(null);
    const found = getOrder(id.trim());
    if (!found) {
      setOrder(null);
      setErr("No order found for that ID on this device. If you ordered on another device, please contact support.");
      return;
    }
    setOrder(found);
  };

  const activeIdx = order ? STAGES.findIndex((s) => s.k === order.status) : -1;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Support</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Track Your Order</h1>
      <p className="mt-3 text-muted-foreground">Enter your order ID (starts with SLQ-) to see status.</p>

      <div className="mt-8 flex gap-2 rounded-full border border-border bg-background p-2 pl-5">
        <Search className="my-auto h-4 w-4 text-muted-foreground" />
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. SLQ-123456-ABCXYZ"
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="flex-1 bg-transparent text-sm outline-none"
        />
        <button onClick={search} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
          Track
        </button>
      </div>

      {err && <p className="mt-6 rounded-xl border border-border bg-secondary p-4 text-sm">{err}</p>}

      {order && (
        <div className="mt-10 rounded-3xl border border-border p-6 md:p-8">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Order</div>
              <div className="font-semibold">{order.orderId}</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Placed</div>
              <div className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-2">
            {STAGES.map((s, i) => {
              const done = i <= activeIdx;
              return (
                <div key={s.k} className="flex flex-col items-center text-center">
                  <div className={`grid h-10 w-10 place-items-center rounded-full border ${done ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>
                    <s.Icon className="h-4 w-4" />
                  </div>
                  <div className={`mt-2 text-xs ${done ? "font-semibold" : "text-muted-foreground"}`}>{s.label}</div>
                </div>
              );
            })}
          </div>
          <div className="relative mt-3 h-1 rounded-full bg-border">
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${((activeIdx + 1) / STAGES.length) * 100}%` }} />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Shipping to</div>
              <div className="mt-1">
                <div className="font-semibold">{order.customer.name}</div>
                <div className="text-muted-foreground">
                  {order.customer.city}, {order.customer.state} {order.customer.pincode}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Total</div>
              <div className="mt-1 font-display text-xl font-bold">₹{order.total.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
