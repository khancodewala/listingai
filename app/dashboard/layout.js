export const metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}