import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import Barcode from "react-barcode";
import { CheckCircle2, Download, Package } from "lucide-react";
import { useOrders } from "@/lib/store";
import { downloadReceipt } from "@/lib/receipt";
import { BRAND } from "@/lib/config";

export const Route = createFileRoute("/confirmation/$orderId")({
  head: () => ({ meta: [{ title: "Order Confirmed — welded" }, { name: "robots", content: "noindex" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderId } = useParams({ from: "/confirmation/$orderId" });
  const order = useOrders((s) => s.orders[orderId]);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Order not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find order {orderId} on this device.</p>
        <Link to="/track" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Track by order ID
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-12">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Order Confirmed</h1>
            <p className="text-sm text-muted-foreground">Thank you, {order.customer.name.split(" ")[0]}. A confirmation is on the way to {order.customer.email}.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 text-sm">
          <Meta k="Order ID" v={order.orderId} />
          <Meta k="Status" v={order.status.toUpperCase()} />
          <Meta k="Payment ID" v={order.razorpayPaymentId ?? "—"} mono />
          <Meta k="Razorpay Order" v={order.razorpayOrderId ?? "—"} mono />
          <Meta k="Placed on" v={new Date(order.createdAt).toLocaleString()} />
          <Meta k="Total Paid" v={`₹${order.total.toLocaleString("en-IN")}`} />
        </div>

        <div className="mt-8 rounded-2xl border border-border p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Shipping to</div>
          <div className="mt-2 text-sm">
            <div className="font-semibold">{order.customer.name}</div>
            <div className="text-muted-foreground">
              {order.customer.address1}{order.customer.address2 ? `, ${order.customer.address2}` : ""}<br />
              {order.customer.city}, {order.customer.state} {order.customer.pincode}<br />
              {order.customer.phone} · {order.customer.email}
            </div>
          </div>
        </div>

        <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
          {order.items.map((it) => (
            <div key={it.productId} className="flex items-center gap-4 p-4">
              <img src={it.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="font-semibold text-sm">{it.name}</div>
                <div className="text-xs text-muted-foreground">{it.tierLabel} · Qty {it.qty}</div>
              </div>
              <div className="text-sm font-semibold">₹{(it.unitPrice * it.qty).toLocaleString("en-IN")}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Scan · Order ID</div>
          <div className="bg-white p-3 rounded-lg">
            <Barcode value={order.orderId} height={60} width={1.6} fontSize={14} background="#ffffff" lineColor="#000000" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => downloadReceipt(order)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Download Receipt (PDF)
          </button>
          <Link
            to="/track"
            search={{ id: order.orderId } as any}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-accent"
          >
            <Package className="h-4 w-4" /> Track Order
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Signed digitally by <span className="italic font-medium text-foreground">{BRAND.name}</span> — Authorised Signatory
        </p>
      </div>
    </div>
  );
}

function Meta({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className={`mt-1 font-semibold ${mono ? "font-mono text-xs" : ""}`}>{v}</div>
    </div>
  );
}
