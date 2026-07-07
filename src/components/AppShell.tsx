import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, ShoppingBag, Package, Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart, useTheme } from "@/lib/store";
import { BRAND } from "@/lib/config";
import { submitEarlyAccess } from "@/lib/early-access.functions";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar />
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground text-xs">
      <div className="overflow-hidden">
        <div className="marquee-track flex gap-16 whitespace-nowrap py-2 font-medium tracking-wide">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-16 shrink-0">
              <span>FREE SHIPPING PAN INDIA</span>
              <span>·</span>
              <span>BUY 2 · SAVE ₹99</span>
              <span>·</span>
              <span>12-MONTH WARRANTY</span>
              <span>·</span>
              <span>7-DAY EASY RETURNS</span>
              <span>·</span>
              <span>NEW: CHROMEPRO EARPHONES ARE HERE</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle, apply } = useTheme();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { apply(); }, [apply]);
  useEffect(() => { setOpen(false); }, [pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/track", label: "Track Order" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-chrome ring-1 ring-border" />
          <span className="font-display text-xl font-bold tracking-tight">{BRAND.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            to="/track"
            aria-label="Track order"
            className="hidden sm:grid h-10 w-10 place-items-center rounded-full hover:bg-accent transition-colors"
          >
            <Package className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-accent transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-accent"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col p-4 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                activeProps={{ className: "bg-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const onEarlyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      toast.error("Please enter a valid email");
      return;
    }
    setBusy(true);
    try {
      await submitEarlyAccess({ data: { email: value } });
      toast.success("You're on the list!");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not save email");
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="border-t border-footer-foreground/10 bg-footer text-footer-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-chrome" />
              <span className="font-display text-2xl font-bold">{BRAND.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-footer-foreground/70">
              {BRAND.tagline}. {BRAND.sub}
            </p>
            <form
              onSubmit={onEarlyAccess}
              className="mt-6 flex max-w-sm items-center gap-2 rounded-full border border-footer-foreground/20 bg-footer-foreground/5 p-1 pl-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
                placeholder="Email for early access"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-footer-foreground/50 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={busy}
                aria-label="Submit email for early access"
                className="grid h-9 w-9 place-items-center rounded-full bg-footer-foreground text-footer hover:opacity-90 disabled:opacity-60"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <FooterCol
            title="Shop"
            links={[
              { to: "/shop", label: "All Products" },
              { to: "/product/chromepro-earphones", label: "Chromepro Earphones" },
              { to: "/track", label: "Track Order" },
              { to: "/cart", label: "Your Cart" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/about", label: "Story" },
              { to: "/about", label: "Careers" },
            ]}
          />
          <FooterCol
            title="Support"
            links={[
              { to: "/contact", label: "Help Center" },
              { to: "/contact", label: "Shipping & Returns" },
              { to: "/contact", label: "Warranty" },
              { to: "/contact", label: "Privacy Policy" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-footer-foreground/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-footer-foreground/60">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {["Instagram", "Twitter", "YouTube"].map((label, i) => (
              <a
                key={i}
                href="#"
                aria-label={label}
                className="grid h-9 min-w-9 place-items-center rounded-full border border-footer-foreground/20 px-3 text-[10px] font-semibold uppercase tracking-widest hover:bg-footer-foreground/10"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-primary-foreground/80">
        {title}
      </h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
