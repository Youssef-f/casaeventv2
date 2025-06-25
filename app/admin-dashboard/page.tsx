"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";

// Sample pending partners data
const samplePendingPartners = [
  {
    id: "p1",
    company: "Jazzablanca SARL",
    email: "jazz@blanca.com",
    submittedAt: "2024-06-01",
  },
  {
    id: "p2",
    company: "Casarestaurants",
    email: "contact@casarestaurants.com",
    submittedAt: "2024-06-02",
  },
];

const ADMIN_EMAIL = "admin@casaevent.com";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPartners, setPendingPartners] = useState(samplePendingPartners);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser || firebaseUser.email !== ADMIN_EMAIL) {
        router.replace("/");
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleAccept = (id: string) => {
    setPendingPartners((prev) => prev.filter((p) => p.id !== id));
    // Here you would update the backend to mark the partner as accepted
  };

  const handleReject = (id: string) => {
    setPendingPartners((prev) => prev.filter((p) => p.id !== id));
    // Here you would update the backend to mark the partner as rejected
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (!user) return null;

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-[#FF5A1F]">
        Admin Dashboard
      </h1>
      <h2 className="text-xl font-semibold mb-6">
        Partenaires en attente de validation
      </h2>
      {pendingPartners.length === 0 ? (
        <div className="text-gray-500 text-center">
          Aucun partenaire en attente.
        </div>
      ) : (
        <div className="space-y-6">
          {pendingPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {partner.company}
                </h3>
                <div className="text-gray-600 text-sm mb-1">
                  {partner.email}
                </div>
                <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Soumis le {partner.submittedAt}
                </span>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button
                  variant="default"
                  onClick={() => handleAccept(partner.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Accepter
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(partner.id)}
                >
                  Rejeter
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
