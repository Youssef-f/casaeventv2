// Custom layout for admin dashboard (no navbar)
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-gray-50 min-h-screen">{children}</div>;
}
