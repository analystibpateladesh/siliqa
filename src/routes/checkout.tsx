import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, Lock, ShoppingBag } from "lucide-react";
import { useCart, useOrders, type SavedOrder } from "@/lib/store";
import { generateOrderId, openRazorpay, submitOrderToSheet } from "@/lib/order-utils";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/payments.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — siliqa" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

type Form = {
  name: string; email: string; phone: string;
  address1: string; address2: string; city: string; state: string; pincode: string;
};

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);
  const saveOrder = useOrders((s) => s.save);

  const [form, setForm] = useState<Form>({
    name: "", email: "", phone: "",
    address1: "", address2: "", city: "", state: "", pincode: "",
  });
  const [busy, setBusy] = useState(false);

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-bold">Nothing to checkout</h1>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Go to shop
        </Link>
      </div>
    );
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.name.trim()) return "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) return "10-digit phone required";
    if (!form.address1.trim()) return "Address is required";
    if (!form.city.trim()) return "City is required";
    if (!form.state.trim()) return "State is required";
    if (!/^\d{6}$/.test(form.pincode)) return "6-digit pincode required";
    return null;
  };

  const pay = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setBusy(true);
    const orderId = generateOrderId();
    try {
      const created = await createRazorpayOrder({
        data: {
          amount: Math.round(total * 100),
          receipt: orderId,
          notes: { customer_email: form.email, customer_name: form.name },
        },
      });
      const pay = await openRazorpay({
        keyId: created.keyId,
        amount: created.amount,
        razorpayOrderId: created.orderId,
        receiptId: orderId,
        customer: { name: form.name, email: form.email, phone: form.phone },
      });
      await verifyRazorpayPayment({
        data: {
          razorpayOrderId: pay.razorpayOrderId,
          razorpayPaymentId: pay.paymentId,
          razorpaySignature: pay.signature,
        },
      });
      const order: SavedOrder = {
        orderId,
        razorpayOrderId: pay.razorpayOrderId,
        razorpayPaymentId: pay.paymentId,
        createdAt: new Date().toISOString(),
        status: "Ordered",
        items,
        subtotal,
        shipping,
        total,
        customer: form,
      };
      saveOrder(order);
      submitOrderToSheet(order).catch(() => {});
      clear();
      navigate({ to: "/confirmation/$orderId", params: { orderId } });
    } catch (e: any) {
      toast.error(e?.message ?? "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  // TEMP DEMO FUNCTION — remove before going live
  const skipPaymentDemo = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setBusy(true);
    const orderId = generateOrderId();
    try {
      const order: SavedOrder = {
        orderId,
        razorpayOrderId: "demo_order_" + orderId,
        razorpayPaymentId: "demo_pay_" + orderId,
        createdAt: new Date().toISOString(),
        status: "Ordered",
        items,
        subtotal,
        shipping,
        total,
        customer: form,
      };
      saveOrder(order);
      submitOrderToSheet(order).catch(() => {});
      clear();
      navigate({ to: "/confirmation/$orderId", params: { orderId } });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-12">
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div className="space-y-8">
          <Section title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" v={form.name} on={(v) => set("name", v)} />
              <Field label="Phone" v={form.phone} on={(v) => set("phone", v)} type="tel" />
              <Field label="Email" v={form.email} on={(v) => set("email", v)} type="email" className="sm:col-span-2" />
            </div>
          </Section>

          <Section title="Shipping Address">
            <div className="grid gap-4">
              <Field label="Address Line 1" v={form.address1} on={(v) => set("address1", v)} />
              <Field label="Address Line 2 (optional)" v={form.address2} on={(v) => set("address2", v)} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City" v={form.city} on={(v) => set("city", v)} />
                <Field label="State" v={form.state} on={(v) => set("state", v)} />
                <Field label="Pincode" v={form.pincode} on={(v) => set("pincode", v)} />
              </div>
            </div>
          </Section>

          <Section title="Payment">
            <div className="rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Razorpay</div>
                  <div className="text-xs text-muted-foreground">Cards, UPI, netbanking, wallets</div>
                </div>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Section>

          <button
            disabled={busy}
            onClick={pay}
            className="w-full rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")}`}
          </button>

          {/* TEMP DEMO LINK — remove before going live */}
          <button
            disabled={busy}
            onClick={skipPaymentDemo}
            className="w-full text-center text-xs text-muted-foreground underline hover:text-foreground"
          >
            Skip payment (demo) — test checkout flow
          </button>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl font-bold">Order Summary</h2>
          <div className="mt-4 divide-y divide-border">
            {items.map((it) => (
              <div key={it.productId} className="flex gap-3 py-3">
                <img src={it.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.tierLabel}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button onClick={() => setQty(it.productId, it.qty - 1)} className="grid h-6 w-6 place-items-center">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold">{it.qty}</span>
                      <button onClick={() => setQty(it.productId, it.qty + 1)} className="grid h-6 w-6 place-items-center">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-sm font-semibold">₹{(it.unitPrice * it.qty).toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">FREE</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 font-display text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label, v, on, type = "text", className = "",
}: { label: string; v: string; on: (v: string) => void; type?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={v}
        onChange={(e) => on(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
      />
    </label>
  );
}