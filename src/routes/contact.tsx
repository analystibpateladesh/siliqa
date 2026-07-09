import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { submitContactToSheet } from "@/lib/order-utils";
import { BRAND } from "@/lib/config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — welded" },
      { name: "description", content: "Get in touch with the welded team. We reply within 24 hours." },
      { property: "og:title", content: "Contact — welded" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill in required fields"); return; }
    setBusy(true);
    await submitContactToSheet({ ...form, submittedAt: new Date().toISOString() });
    toast.success("Thanks! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Contact</p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-tight md:text-6xl">Say hello.</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Questions, feedback, wholesale, press — we'd love to hear from you.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          {[
            { Ic: Mail, k: "Email", v: BRAND.email },
            { Ic: Phone, k: "Phone", v: BRAND.phone },
            { Ic: MapPin, k: "Address", v: BRAND.address },
          ].map((c, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-border p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary">
                <c.Ic className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.k}</div>
                <div className="mt-1 font-semibold">{c.v}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name *" v={form.name} on={(v) => setForm({ ...form, name: v })} />
            <Field label="Email *" v={form.email} on={(v) => setForm({ ...form, email: v })} type="email" />
            <Field label="Phone" v={form.phone} on={(v) => setForm({ ...form, phone: v })} />
            <Field label="Subject" v={form.subject} on={(v) => setForm({ ...form, subject: v })} />
          </div>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-muted-foreground">Message *</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </label>
          <button
            disabled={busy}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, v, on, type = "text" }: { label: string; v: string; on: (v: string) => void; type?: string }) {
  return (
    <label className="block">
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
