import { Outlet, useLocation } from "react-router-dom";
import { LogOut, Menu, Search, User } from "lucide-react";
import { useState } from "react";

import DashboardSidebar from "@/components/DashboardSidebar";
import NotificationBell from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import usePageTitle from "@/hooks/usePageTitle";

const ROLE_LABELS: Record<string, string> = {
  admin: "Super Admin",
  super_distributor: "Super Distributor",
  master_distributor: "Master Distributor",
  distributor: "Distributor",
  retailer: "Retailer",
};

export default function DashboardLayout() {
  const { profile, role, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const dashTitle = (() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const moduleKey = parts[1] || "";
    if (!moduleKey) return "Dashboard";
    const pretty = moduleKey.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return `Dashboard - ${pretty}`;
  })();

  usePageTitle(`GauryaTech | ${dashTitle}`);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-gradient-hero" />
      <div className="fixed inset-0 -z-10 bg-grid opacity-30" />
      <div className="fixed right-[-8rem] top-[-6rem] -z-10 h-[22rem] w-[22rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-[1700px] gap-3 p-2 sm:p-3 lg:gap-4 lg:p-4">
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="surface-panel flex min-h-[5rem] items-center justify-between rounded-[1.5rem] px-3 py-3 sm:min-h-[5.5rem] sm:rounded-[2rem] sm:px-6">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-2xl lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[min(290px,100vw-12px)] border-r-0 bg-transparent p-0 shadow-none">
                  <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px] sm:tracking-[0.22em]">Workspace</div>
                <h1 className="truncate font-heading text-xl font-black tracking-tight text-foreground sm:text-3xl">{dashTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-3 rounded-full border border-border bg-background/70 px-4 py-3 sm:flex">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users, transactions, tickets..."
                  autoComplete="off"
                  className="w-56 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground lg:w-72"
                />
              </div>

              <NotificationBell />

              <div className="hidden items-center gap-3 rounded-full border border-border bg-background/70 px-3 py-2 md:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="max-w-[11rem] truncate text-sm font-semibold text-foreground">{profile?.full_name || "User"}</div>
                  <div className="text-xs text-muted-foreground">{role ? ROLE_LABELS[role] : "Loading..."}</div>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={signOut} title="Sign out" className="rounded-2xl">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-auto">
            <div className="surface-panel min-h-full rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-5 lg:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
