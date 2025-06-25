"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  if (
    pathname === "/welcome" ||
    pathname === "/user-type" ||
    pathname.startsWith("/admin-dashboard")
  ) {
    return null;
  }
  return <Header />;
}
