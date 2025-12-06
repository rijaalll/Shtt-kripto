import DashboardShell from "@/src/components/layout/DashboardShell";

export const metadata = {
  title: "Dashboard - Shtt",
  description: "Secure Encryption Tools",
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}