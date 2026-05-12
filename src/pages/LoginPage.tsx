import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, LogIn, Mail, ShieldCheck, Sparkles } from "lucide-react";

import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, setAuthSession } from "@/services/api";
import usePageTitle from "@/hooks/usePageTitle";

type ForgotStep = "idle" | "identity" | "otp" | "new_password" | "done";

const loginHighlights = [
  "Admin-grade partner controls",
  "Wallet, KYC, and service operations",
  "Built for fast daily execution",
];

export default function LoginPage() {
  usePageTitle("GauryaTech | Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [forgotStep, setForgotStep] = useState<ForgotStep>("idle");
  const [fpEmail, setFpEmail] = useState("");
  const [fpAadhaarLast4, setFpAadhaarLast4] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpShowNew, setFpShowNew] = useState(false);
  const [fpShowConfirm, setFpShowConfirm] = useState(false);
  const [fpResetToken, setFpResetToken] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpDemoOtp, setFpDemoOtp] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthSession(data.access_token, data.user);
      const next = searchParams.get("next");
      if (next && next.startsWith("/") && !next.startsWith("//")) {
        navigate(next);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpEmail || fpAadhaarLast4.length !== 4) {
      toast({ title: "Invalid input", description: "Enter your email and last 4 digits of Aadhaar.", variant: "destructive" });
      return;
    }
    setFpLoading(true);
    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ action: "verify_identity", email: fpEmail, aadhaar_last4: fpAadhaarLast4 }),
      });
      if (res.error) throw new Error(res.error);
      if (res?._demo_otp) setFpDemoOtp(res._demo_otp);
      toast({ title: "OTP Sent", description: res?.otp_hint || "Check your registered email for OTP." });
      setForgotStep("otp");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setFpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpOtp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Enter the 6-digit OTP.", variant: "destructive" });
      return;
    }
    setFpLoading(true);
    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ action: "verify_otp", email: fpEmail, otp: fpOtp }),
      });
      if (res.error) throw new Error(res.error);
      setFpResetToken(res.reset_token);
      toast({ title: "OTP Verified", description: "You can now set a new password." });
      setForgotStep("new_password");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpNewPassword.length < 6) {
      toast({ title: "Weak password", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setFpLoading(true);
    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ action: "reset_password", email: fpEmail, reset_token: fpResetToken, new_password: fpNewPassword }),
      });
      if (res.error) throw new Error(res.error);
      toast({ title: "Password Reset!", description: "You can now login with your new password." });
      setForgotStep("done");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setFpLoading(false);
    }
  };

  const resetForgotState = () => {
    setForgotStep("idle");
    setFpEmail("");
    setFpAadhaarLast4("");
    setFpOtp("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpResetToken("");
    setFpDemoOtp("");
  };

  const forgotCardClass = "surface-panel rounded-[1.5rem] p-6 shadow-elevated sm:rounded-[2rem] sm:p-8";

  const renderForgotPassword = () => {
    if (forgotStep === "identity") {
      return (
        <form onSubmit={handleVerifyIdentity} className={forgotCardClass}>
          <ShieldCheck className="h-10 w-10 text-primary" />
          <h2 className="mt-5 font-heading text-2xl font-black tracking-tight text-foreground">Verify identity</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Enter your registered email and the last 4 digits of your Aadhaar number.</p>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fp-email">Registered Email</Label>
              <Input id="fp-email" type="email" placeholder="you@example.com" value={fpEmail} onChange={(e) => setFpEmail(e.target.value)} required className="h-12 rounded-xl bg-background/70" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fp-aadhaar">Last 4 Digits of Aadhaar Number</Label>
              <Input
                id="fp-aadhaar"
                type="text"
                placeholder="1234"
                maxLength={4}
                value={fpAadhaarLast4}
                onChange={(e) => setFpAadhaarLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                required
                className="h-12 rounded-xl bg-background/70"
              />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <Button type="submit" className="h-12 w-full rounded-xl bg-gradient-primary text-primary-foreground" disabled={fpLoading}>
              <Mail className="mr-2 h-4 w-4" />
              {fpLoading ? "Verifying..." : "Send OTP"}
            </Button>
            <button type="button" onClick={resetForgotState} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </button>
          </div>
        </form>
      );
    }

    if (forgotStep === "otp") {
      return (
        <form onSubmit={handleVerifyOtp} className={forgotCardClass}>
          <KeyRound className="h-10 w-10 text-primary" />
          <h2 className="mt-5 font-heading text-2xl font-black tracking-tight text-foreground">Enter OTP</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A 6-digit OTP has been sent to {fpEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
          </p>
          {fpDemoOtp ? (
            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
              Demo OTP: <span className="font-mono font-bold">{fpDemoOtp}</span>
            </div>
          ) : null}
          <div className="mt-6 space-y-2">
            <Label htmlFor="fp-otp">6-Digit OTP</Label>
            <Input
              id="fp-otp"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={fpOtp}
              onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              className="h-14 rounded-xl bg-background/70 text-center font-mono text-lg tracking-[0.45em]"
            />
          </div>
          <div className="mt-6 space-y-3">
            <Button type="submit" className="h-12 w-full rounded-xl bg-gradient-primary text-primary-foreground" disabled={fpLoading || fpOtp.length !== 6}>
              {fpLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <button type="button" onClick={() => setForgotStep("identity")} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </form>
      );
    }

    if (forgotStep === "new_password") {
      return (
        <form onSubmit={handleResetPassword} className={forgotCardClass}>
          <KeyRound className="h-10 w-10 text-primary" />
          <h2 className="mt-5 font-heading text-2xl font-black tracking-tight text-foreground">Set new password</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose a secure password to restore account access.</p>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fp-new">New Password</Label>
              <div className="relative">
                <Input id="fp-new" type={fpShowNew ? "text" : "password"} value={fpNewPassword} onChange={(e) => setFpNewPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl bg-background/70 pr-10" />
                <button type="button" onClick={() => setFpShowNew(!fpShowNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {fpShowNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fp-confirm">Confirm New Password</Label>
              <div className="relative">
                <Input id="fp-confirm" type={fpShowConfirm ? "text" : "password"} value={fpConfirmPassword} onChange={(e) => setFpConfirmPassword(e.target.value)} required className="h-12 rounded-xl bg-background/70 pr-10" />
                <button type="button" onClick={() => setFpShowConfirm(!fpShowConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {fpShowConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-gradient-primary text-primary-foreground"
              disabled={fpLoading || fpNewPassword.length < 6 || fpNewPassword !== fpConfirmPassword}
            >
              {fpLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
      );
    }

    if (forgotStep === "done") {
      return (
        <div className={forgotCardClass}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-5 font-heading text-2xl font-black tracking-tight text-foreground">Password reset successful</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">You can now return to the sign-in screen and log in with your new password.</p>
          <div className="mt-6">
            <Button onClick={resetForgotState} className="h-12 w-full rounded-xl bg-gradient-primary text-primary-foreground">
              <LogIn className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-0 -z-10 bg-gradient-hero" />
      <div className="fixed inset-0 -z-10 bg-grid opacity-40" />
      <div className="fixed left-[-10%] top-[-10%] -z-10 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="fixed bottom-[-15%] right-[-12%] -z-10 h-[26rem] w-[26rem] rounded-full bg-accent/80 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-6 px-4 py-6 sm:py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <section className="surface-strong hidden min-h-[42rem] rounded-[2.5rem] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandMark subtitle="Partner Control Layer" className="[&_*]:text-white" />
            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              Redesigned For Fast Operations
            </div>
            <h1 className="mt-6 font-heading text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white">
              A sharper way to run your fintech network.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/80">
              Sign into a calmer workspace for service operations, downline management, wallet movement, and support.
            </p>
          </div>

          <div className="space-y-4">
            {loginHighlights.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[1.5rem] border border-white/12 bg-white/10 px-5 py-4 text-sm text-white/90">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="inline-flex items-center">
              <BrandMark subtitle="Secure Login" />
            </Link>
            <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Back to website
            </Link>
          </div>

          {forgotStep !== "idle" ? (
            renderForgotPassword()
          ) : (
            <div className="surface-panel rounded-[1.5rem] p-6 shadow-elevated sm:rounded-[2.25rem] sm:p-10">
              <div className="rounded-[1.5rem] bg-secondary/60 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Secure Partner Portal</div>
                <h2 className="mt-3 font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">Welcome back</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use your account credentials to enter the GauryaTech operations dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="partner@gauryatech.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 rounded-2xl bg-background/70"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                      Password
                    </Label>
                    <button type="button" onClick={() => setForgotStep("identity")} className="text-xs font-semibold text-primary transition-colors hover:text-primary/80">
                      Recover access
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-14 rounded-2xl bg-background/70 pr-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="h-14 w-full rounded-2xl bg-gradient-primary text-base font-bold text-primary-foreground shadow-glow" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Enter Dashboard
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 border-t border-border pt-6 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Restricted access system
                <br />
                © 2026 GauryaTech Digital Solutions
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
