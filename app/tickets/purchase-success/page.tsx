"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Ticket from "@/components/Ticket";

interface TicketData {
  _id: string;
  eventName: string;
  eventDate: Timestamp | any;
  location: string;
  isCancelled: boolean;
  purchasedAt: Timestamp | any;
  price: number;
  // ajoute d’autres champs si besoin
}

export default function TicketSuccess() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [latestTicket, setLatestTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/");
        return;
      }
      setUser(firebaseUser);

      try {
        // Query Firestore pour récupérer les tickets de l'utilisateur, triés par date d'achat décroissante
        const ticketsRef = collection(db, "tickets");
        const q = query(
          ticketsRef,
          where("userId", "==", firebaseUser.uid),
          orderBy("purchasedAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          router.push("/");
          return;
        }

        // Prendre le ticket le plus récent
        const ticketDoc = querySnapshot.docs[0];
        const data = ticketDoc.data();

        const ticket: TicketData = {
          _id: ticketDoc.id,
          eventName: data.eventName,
          eventDate: data.eventDate,
          location: data.location,
          isCancelled: data.isCancelled,
          purchasedAt: data.purchasedAt,
          price: data.price,
        };

        setLatestTicket(ticket);
      } catch (error) {
        console.error("Erreur récupération tickets :", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!latestTicket) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Achat de ticket réussi !</h1>
          <p className="mt-2 text-gray-600">
            Votre ticket est confirmé et prêt à être utilisé.
          </p>
        </div>

        {/* Carte du ticket */}
        <div
          className={`bg-white p-6 rounded-lg shadow-sm border ${
            latestTicket.isCancelled ? "border-red-200" : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-900">{latestTicket.eventName}</h2>
          <p className="mt-1 text-gray-600">
            Date :{" "}
            {latestTicket.eventDate?.toDate
              ? latestTicket.eventDate.toDate().toLocaleDateString()
              : new Date(latestTicket.eventDate).toLocaleDateString()}
            <br />
            Lieu : {latestTicket.location}
          </p>
          <p className="mt-2">
            Statut :{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                latestTicket.isCancelled
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {latestTicket.isCancelled ? "Annulé" : "Valide"}
            </span>
          </p>
          <p className="mt-2 text-gray-700">
            Achat effectué le :{" "}
            {latestTicket.purchasedAt?.toDate
              ? latestTicket.purchasedAt.toDate().toLocaleDateString()
              : new Date(latestTicket.purchasedAt).toLocaleDateString()}
          </p>
          <p className="mt-2 text-gray-900 font-semibold">
            Prix : {latestTicket.price} £
          </p>
        </div>
      </div>
    </div>
  );
}
