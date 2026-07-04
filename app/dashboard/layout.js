export const metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://listingai-rose.vercel.app/dashboard",
  },
};

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}