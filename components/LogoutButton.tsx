"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
