import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronRight, Layers, Link2, Shield, Sparkles, Users, Wallet, Zap } from "lucide-react";

import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MARKETING_SERVICES } from "@/data/services";
import usePageTitle from "@/hooks/usePageTitle";
import { apiFetch } from "@/services/api";

const stats = [
  { value: "50K+", label: "Retailers activated" },
  { value: "Rs 500Cr+", label: "Monthly transaction volume" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "< 2 sec", label: "Average service response" },
];

const valuePillars = [
  {
    title: "Distribution-first",
    text: "Built for admins, distributors, and retailers with clear controls and downline visibility.",
    icon: Layers,
  },
  {
    title: "Fast money movement",
    text: "Wallets, settlements, payouts, and service execution are designed to keep operations moving.",
    icon: Wallet,
  },
  {
    title: "Compliance-ready",
    text: "KYC workflows, role permissions, and audit-friendly operations are part of the core product.",
    icon: Shield,
  },
];

const proofPoints = [
  "AEPS, BBPS, remittance, recharge, and payout in one stack",
  "Admin controls for services, permissions, and commissions",
  "Retailer-ready interface with simple onboarding and support",
  "Designed for scale across large partner networks",
];

export default function LandingPage() {
  usePageTitle("GauryaTech | Home");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  async function submitContact(e: FormEvent) {
    e.preventDefault();
    if (contactSending) return;

    setContactError(null);
    setContactSuccess(null);
    setContactSending(true);
    try {
      await apiFetch("/public/contact", {
        method: "POST",
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          mobile: contactMobile,
          message: contactMessage,
        }),
      });
      setContactSuccess("Thanks! Your query has been sent to sales@gauryatech.com.");
      setContactName("");
      setContactEmail("");
      setContactMobile("");
      setContactMessage("");
    } catch (err: any) {
      setContactError(err?.message || "Failed to send. Please try again.");
    } finally {
      setContactSending(false);
    }
  }

  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-gradient-hero" />
      <div className="fixed inset-0 -z-10 bg-grid opacity-40" />
      <div className="fixed left-[-12%] top-[-8%] -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="fixed bottom-[-14%] right-[-10%] -z-10 h-[24rem] w-[24rem] rounded-full bg-accent/70 blur-3xl" />

      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-20">
          <Link to="/" className="flex items-center">
            <BrandMark subtitle="Fintech Infrastructure" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#platform" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Platform</a>
            <a href="#services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Services</a>
            <a href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</a>
            <Link to="/blogs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Blogs</Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button variant="hero-outline" size="sm" className="rounded-full px-3 sm:px-5">
                Login
              </Button>
            </Link>
            <Button asChild variant="hero" size="sm" className="rounded-full px-3 sm:px-5">
              <a href="#contact">Talk to Sales</a>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="container mx-auto px-4 pb-14 pt-14 sm:pt-20">
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary shadow-card sm:text-xs sm:tracking-[0.22em]">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="truncate">Built For Bharat-Scale Service Networks</span>
              </div>

              <h1 className="max-w-4xl font-heading text-4xl font-black leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                The control room for{" "}
                <span className="text-gradient-primary">modern fintech distribution.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8">
                GauryaTech unifies service delivery, partner operations, wallets, and compliance into a sharper,
                faster interface for admins and retailers alike.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login">
                  <Button variant="hero" size="lg" className="h-12 rounded-full px-6 text-sm sm:h-14 sm:px-8 sm:text-base">
                    Open Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#services">
                  <Button variant="hero-outline" size="lg" className="h-12 rounded-full px-6 text-sm sm:h-14 sm:px-8 sm:text-base">
                    Explore Services
                  </Button>
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="surface-panel ring-panel rounded-[1.75rem] px-5 py-6">
                    <div className="font-heading text-3xl font-black tracking-tight text-foreground">{stat.value}</div>
                    <div className="mt-2 text-sm leading-6 text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pt-3">
              <div className="surface-strong rounded-[1.5rem] p-5 ring-panel sm:rounded-[2rem] sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Live Snapshot</div>
                    <div className="mt-2 font-heading text-2xl font-black tracking-tight sm:text-3xl">Admin Operations</div>
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    Real-time
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5">
                    <div className="text-sm text-white/70">Wallet movement</div>
                    <div className="mt-3 font-heading text-3xl font-black sm:text-4xl">Rs 2.4Cr</div>
                    <div className="mt-2 text-sm text-emerald-200">+18% this week</div>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5">
                    <div className="text-sm text-white/70">Active services</div>
                    <div className="mt-3 font-heading text-3xl font-black sm:text-4xl">18</div>
                    <div className="mt-2 text-sm text-cyan-100">Across payments, banking, and utilities</div>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-white/12 bg-slate-950/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">Operator confidence</div>
                      <div className="text-sm text-white/70">Clear actions for approval, transfers, and support</div>
                    </div>
                    <Users className="h-9 w-9 text-white/90" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {proofPoints.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="container mx-auto px-4 py-10">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="surface-panel rounded-[2rem] p-7">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Platform Edge</div>
              <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                A calmer interface for complicated operations.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                We redesigned the experience around faster scanning, stronger separation, and clearer action states so
                teams can move money and manage people without fighting the UI.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {valuePillars.map((pillar) => (
                <div key={pillar.title} className="surface-panel rounded-[2rem] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <pillar.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-foreground">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="container mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Service Stack</div>
              <h2 className="mt-3 font-heading text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                One surface, many business lines.
              </h2>
            </div>
            <Link to="/services" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
              View full catalogue <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {MARKETING_SERVICES.map((svc, index) => (
              <Link
                key={svc.key}
                to={`/services/${svc.key}`}
                className={`group surface-panel rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${
                  index % 3 === 0 ? "xl:translate-y-6" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary">
                    <svc.icon className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {svc.key.replace(/[-_]/g, " ")}
                  </span>
                </div>
                <h3 className="mt-10 font-heading text-2xl font-bold tracking-tight text-foreground">{svc.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{svc.description}</p>
                <div className="mt-8 inline-flex items-center text-sm font-semibold text-primary">
                  Explore service <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-14">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-panel rounded-[1.5rem] p-6 sm:rounded-[2rem] sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Security + Scale</div>
              <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Built for growth without sacrificing controls.
              </h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  "Role-based access and downline visibility",
                  "KYC-ready profile and document flows",
                  "Wallet operations with transaction trails",
                  "Service toggles and platform-level management",
                ].map((item) => (
                  <div key={item} className="rounded-[1.5rem] bg-secondary/70 px-5 py-4 text-sm leading-6 text-secondary-foreground">
                    <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-strong rounded-[1.5rem] p-6 sm:rounded-[2rem] sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                <Zap className="h-3.5 w-3.5" />
                Faster Partner Ops
              </div>
              <h3 className="mt-6 font-heading text-3xl font-black tracking-tight">
                Ready to modernize the way your network works?
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/80">
                GauryaTech gives teams a cleaner operating layer for service activation, fund movement, and daily
                support across the distribution chain.
              </p>
              <div className="mt-8">
                <Button asChild variant="secondary" size="lg" className="h-12 rounded-full bg-white px-6 text-slate-900 hover:bg-white/90 sm:h-14">
                  <a href="#contact">
                    Book a conversation
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="container mx-auto px-4 pb-16 pt-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="surface-panel rounded-[1.5rem] p-6 sm:rounded-[2rem] sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Contact</div>
              <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground">Let’s plan your rollout.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Reach out for onboarding, pricing, deployment support, or platform demos.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Call</div>
                  <a className="mt-2 inline-block text-lg font-semibold text-foreground hover:underline" href="tel:+918860037218">
                    +91 88600 37218
                  </a>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</div>
                  <a className="mt-2 inline-block text-lg font-semibold text-foreground hover:underline" href="mailto:care@gauryatech.com">
                    care@gauryatech.com
                  </a>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Office</div>
                  <div className="mt-2 text-sm leading-7 text-foreground">
                    2nd Floor, Plot No - 3, KH. NO. 33/6
                    <br />
                    Amberhai, Sector-19, Dwarka
                    <br />
                    New Delhi - 110043
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-panel rounded-[1.5rem] p-6 sm:rounded-[2rem] sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Send Query</div>
                  <div className="mt-2 text-sm text-muted-foreground">Messages go to sales@gauryatech.com</div>
                </div>
                <div className="hidden rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:block">
                  Response within 1 business day
                </div>
              </div>

              <form onSubmit={submitContact} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your name" required />
                  <Input value={contactMobile} onChange={(e) => setContactMobile(e.target.value)} placeholder="Mobile number" inputMode="tel" required />
                </div>
                <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Work email" type="email" required />
                <Textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Tell us about your network, use case, or target rollout." required rows={6} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" variant="hero" size="lg" className="h-13 rounded-full px-7" disabled={contactSending}>
                    {contactSending ? "Sending..." : "Submit inquiry"}
                  </Button>
                  <div className="text-xs text-muted-foreground">Secure sales and onboarding intake</div>
                </div>

                {contactError ? <div className="text-sm text-red-500">{contactError}</div> : null}
                {contactSuccess ? <div className="text-sm text-emerald-600">{contactSuccess}</div> : null}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-card/80">
        <div className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-3">
          <div>
            <BrandMark subtitle="Digital Platform" />
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              A cleaner operational layer for partner-led fintech and digital service businesses.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-xl font-bold text-foreground">Navigate</h3>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: "About", to: "/about" },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Refund Policy", to: "/refund-policy" },
                { label: "Terms & Conditions", to: "/terms" },
              ].map((item) => (
                <Link key={item.label} to={item.to} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-xl font-bold text-foreground">Top Services</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {MARKETING_SERVICES.slice(0, 8).map((svc) => (
                <Link key={svc.key} to={`/services/${svc.key}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {svc.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
