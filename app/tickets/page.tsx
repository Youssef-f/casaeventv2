"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";

// Sample ticket data
const sampleTickets = [
  {
    id: "1",
    event: "Concert de Jazz",
    date: "2025-07-01",
    location: "Casablanca - Parc de la Ligue Arabe",
    status: "Réservé",
  },
  {
    id: "2",
    event: "Festival Mawazine",
    date: "2025-06-15",
    location: "Scène Nahda",
    status: "Réservé",
  },
];

export default function TicketsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(sampleTickets);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/sign-in");
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleCancel = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (!user) return null;

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-[#FF5A1F]">
        Mes Réservations
      </h1>
      {tickets.length === 0 ? (
        <div className="text-gray-500 text-center">
          Aucune réservation trouvée.
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {ticket.event}
                </h2>
                <div className="text-gray-600 text-sm mb-1">
                  {ticket.date} - {ticket.location}
                </div>
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {ticket.status}
                </span>
              </div>
              <Button
                variant="destructive"
                className="mt-4 md:mt-0"
                onClick={() => handleCancel(ticket.id)}
              >
                Annuler la réservation
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
