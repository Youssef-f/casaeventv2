"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/casaeventlogo.png";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app } from "@/lib/firebase"; // chemin vers ta config Firebase
import { usePathname } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <nav className="w-full bg-white dark:bg-black shadow flex items-center justify-between px-6 py-3 sticky top-0 z-50 transition-colors duration-300">
      {/* Logo à gauche */}
      <div className="flex items-center flex-shrink-0">
        <Image src={logo} alt="logo" width={48} height={48} />
        <span className="font-bold text-lg text-[#FF5A1F] ml-2 dark:text-[#FF5A1F]">
          Cas@Event
        </span>
      </div>

      {/* Menu centré */}
      {!(pathname && pathname.startsWith("/seller")) && (
        <ul className="flex gap-8 font-semibold text-black dark:text-white flex-grow justify-center text-lg md:text-xl">
          <li>
            <Link
              href="#"
              className="text-[#FF5A1F] dark:text-[#FF5A1F] hover:underline"
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Événements
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Activités
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Restaurants
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Réservations
            </Link>
          </li>
        </ul>
      )}

      {/* Boutons à droite */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {user ? (
          <div className="flex items-center gap-3">
            {/* Show 'Devenir Partenaire' only if not logged in */}
            {!user && !(pathname && pathname.startsWith("/seller")) && (
              <Link href="/partner-signup">
                <button className="bg-[#FF5A1F] text-white px-3 py-1.5 text-sm rounded-lg hover:bg-[#e04e1a] transition">
                  Devenir Partenaire
                </button>
              </Link>
            )}
            <Link href="/tickets">
              <button className="bg-white text-black px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
                Mes Tickets
              </button>
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                <Image
                  src={
                    user && user.photoURL
                      ? user.photoURL
                      : "/default-avatar.png"
                  }
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 text-sm rounded shadow-md p-2 z-50">
                  <button
                    onClick={() => signOut(auth)}
                    className="text-red-500 hover:underline"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link href="/user-type">
            <button className="bg-[#FF5A1F] text-white px-4 py-2 rounded-full font-bold hover:bg-[#e04e1a] transition">
              Connexion
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
