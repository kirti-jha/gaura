import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Award,
  Banknote,
  BarChart3,
  Box,
  Building2,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  CreditCard as CreditCardIcon,
  Download,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Package,
  Plane,
  QrCode,
  Radio,
  Receipt,
  Send,
  Settings,
  Settings2,
  Shield,
  ShieldCheck,
  Smartphone,
  User,
  UserCog,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import BrandMark from "@/components/BrandMark";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/services/api";

type AppRole = "admin" | "super_distributor" | "master_distributor" | "distributor" | "retailer";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  minRole?: AppRole;
  allowedRoles?: AppRole[];
  section?: string;
  serviceKey?: string;
  permissionKey?: string;
  masterOnly?: boolean;
}

const ROLE_LEVEL: Record<AppRole, number> = {
  admin: 1,
  super_distributor: 2,
  master_distributor: 3,
  distributor: 4,
  retailer: 5,
};

const ICON_MAP: Record<string, typeof LayoutDashboard> = {
  aeps: Fingerprint,
  bbps: Receipt,
  dmt: Send,
  recharge: Smartphone,
  loan: Banknote,
  credit_card: CreditCard,
  cc_bill_pay: CreditCardIcon,
  payout: ArrowLeftRight,
  matm: Radio,
  bank_account: Building2,
  pan: FileText,
  ppi_wallet: Wallet,
  travel_booking: Plane,
  travel_package: Package,
  insurance: ShieldCheck,
  pg: QrCode,
  pos: Landmark,
  sound_box: Box,
};

const staticItems: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard", section: "Main" },
  { label: "Users", icon: Users, path: "/dashboard/users", minRole: "master_distributor", section: "Main", permissionKey: "can_manage_users" },
  { label: "Wallet & Funds", icon: Wallet, path: "/dashboard/wallet", section: "Main" },
  { label: "Fund Requests", icon: Banknote, path: "/dashboard/fund-requests", section: "Main" },
  { label: "Transactions", icon: ArrowLeftRight, path: "/dashboard/transactions", section: "Main" },
];

const managementItems: NavItem[] = [
  { label: "Staff Mgmt", icon: UserCog, path: "/dashboard/staff-management", allowedRoles: ["admin"], section: "Management", masterOnly: true },
  { label: "Commissions", icon: BarChart3, path: "/dashboard/commissions", minRole: "distributor", section: "Management", permissionKey: "can_manage_commissions" },
  { label: "KYC", icon: FileText, path: "/dashboard/kyc", minRole: "distributor", section: "Management" },
  { label: "Reports", icon: FileSpreadsheet, path: "/dashboard/reports", section: "Management", permissionKey: "can_view_reports" },
  { label: "Service Mgmt", icon: Settings2, path: "/dashboard/service-management", allowedRoles: ["admin"], section: "Management", permissionKey: "can_manage_services" },
  { label: "Security", icon: Shield, path: "/dashboard/security", allowedRoles: ["admin"], section: "Management", permissionKey: "can_manage_security" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings", allowedRoles: ["admin"], section: "Management", permissionKey: "can_manage_settings" },
];

const userSettingsItems: NavItem[] = [
  { label: "Commission Plan", icon: BarChart3, path: "/dashboard/commission-plan", section: "Setting", allowedRoles: ["super_distributor", "master_distributor", "distributor", "retailer"] },
  { label: "Profile", icon: User, path: "/dashboard/profile", section: "Setting", allowedRoles: ["super_distributor", "master_distributor", "distributor", "retailer"] },
  { label: "TPIN", icon: KeyRound, path: "/dashboard/tpin", section: "Setting", allowedRoles: ["super_distributor", "master_distributor", "distributor", "retailer"] },
  { label: "Change Password", icon: Lock, path: "/dashboard/change-password", section: "Setting", allowedRoles: ["super_distributor", "master_distributor", "distributor", "retailer"] },
  { label: "Certificate Download", icon: Award, path: "/dashboard/certificate", section: "Setting", allowedRoles: ["super_distributor", "master_distributor", "distributor", "retailer"] },
  { label: "Device Driver", icon: Download, path: "/dashboard/device-driver", section: "Setting", allowedRoles: ["super_distributor", "master_distributor", "distributor", "retailer"] },
];

interface Props {
  onNavigate?: () => void;
}

export default function DashboardSidebar({ onNavigate }: Props) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, isMasterAdmin, permissions } = useAuth();
  const [serviceItems, setServiceItems] = useState<NavItem[]>([]);
  const [servicesOpen, setServicesOpen] = useState(false);

  const isRetailer = role === "retailer";
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;
      try {
        const services = await apiFetch("/users/services");
        if (services) {
          setServiceItems(
            services.map((s: any) => ({
              label: s.serviceLabel,
              icon: ICON_MAP[s.serviceKey] || Zap,
              path: s.routePath,
              serviceKey: s.serviceKey,
              section: "Services",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching services for sidebar:", err);
      }
    };
    fetchServices();
  }, [user]);

  useEffect(() => {
    if (serviceItems.some((s) => location.pathname === s.path)) setServicesOpen(true);
  }, [location.pathname, serviceItems]);

  const nonServiceItems = [...staticItems, ...managementItems, ...userSettingsItems].filter((item) => {
    if (!role) return false;
    if (item.masterOnly && !isMasterAdmin) return false;
    if (item.allowedRoles && !item.allowedRoles.includes(role)) return false;
    if (item.minRole && ROLE_LEVEL[role] > ROLE_LEVEL[item.minRole]) return false;
    if (isAdmin && !isMasterAdmin && item.permissionKey) {
      if (!(permissions as any)[item.permissionKey]) return false;
    }
    return true;
  });

  const sections: { name: string; items: NavItem[] }[] = [];
  let lastSection = "";
  for (const item of nonServiceItems) {
    if (item.section !== lastSection) {
      sections.push({ name: item.section || "", items: [] });
      lastSection = item.section || "";
    }
    sections[sections.length - 1].items.push(item);
  }

  const showServicesDropdown = isRetailer && serviceItems.length > 0;

  const renderNavLink = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        className={cn(
          "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all",
          isActive
            ? "bg-primary text-primary-foreground shadow-card"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className="h-4.5 w-4.5 shrink-0" />
        {!collapsed ? <span className="truncate">{item.label}</span> : null}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "surface-panel sticky top-0 flex h-[calc(100vh-1rem)] flex-col rounded-[1.5rem] border border-sidebar-border px-3 py-3 transition-all duration-300 sm:h-[calc(100vh-1.5rem)] sm:rounded-[2rem]",
        collapsed ? "w-[88px]" : "w-[290px]"
      )}
    >
      <div className="rounded-[1.5rem] bg-secondary/60 p-4">
        <BrandMark showText={!collapsed} subtitle="Partner Console" className={cn(collapsed ? "justify-center" : "")} iconClassName="h-11 w-11 rounded-2xl" />
        {!collapsed ? (
          <div className="mt-4 rounded-[1.25rem] bg-background/80 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Workspace</div>
            <div className="mt-1 text-sm font-semibold text-foreground">Operations Dashboard</div>
          </div>
        ) : null}
      </div>

      <nav className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {sections.map((section) => (
          <div key={section.name}>
            {!collapsed ? (
              <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">{section.name}</div>
            ) : null}

            <div className="space-y-1.5">
              {section.name === "Main" && showServicesDropdown ? (
                <>
                  {section.items.filter((item) => item.path === "/dashboard").map((item) => renderNavLink(item))}

                  <div className="pt-1">
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      title={collapsed ? "Services" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all",
                        servicesOpen ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Box className="h-4.5 w-4.5 shrink-0" />
                      {!collapsed ? (
                        <>
                          <span className="flex-1 truncate text-left">Services</span>
                          <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", servicesOpen && "rotate-180")} />
                        </>
                      ) : null}
                    </button>

                    {servicesOpen ? (
                      <div className={cn("mt-2 space-y-1.5", collapsed ? "" : "border-l border-sidebar-border/70 pl-3")}>
                        {serviceItems.map((item) => {
                          const isActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={onNavigate}
                              title={collapsed ? item.label : undefined}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                collapsed ? "justify-center" : ""
                              )}
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              {!collapsed ? <span className="truncate">{item.label}</span> : null}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  {section.items.filter((item) => item.path !== "/dashboard").map((item) => renderNavLink(item))}
                </>
              ) : (
                section.items.map((item) => renderNavLink(item))
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 space-y-2">
        {renderNavLink({ label: "Contact Support", icon: MessageCircle, path: "/dashboard/support", section: "Help" })}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden h-12 w-full items-center justify-center rounded-2xl border border-sidebar-border text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground lg:flex"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
}
