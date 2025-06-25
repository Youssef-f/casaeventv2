"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import Ticket from "@/components/Ticket"; // supposé exister, sinon retirer
import { ArrowLeft, Download, Share2 } from "lucide-react";

interface Event {
  name: string;
  eventDate: number;
  location: string;
  is_cancelled: boolean;
}

interface TicketData {
  _id: string;
  userId: string;
  event: Event;
  purchasedAt: number;
}

export default function TicketPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/");
        return;
      }
      setUser(firebaseUser);

      // Simuler fetch ticket par ID et vérifier user
      fetchTicket(params.id as string).then((t) => {
        if (!t || t.userId !== firebaseUser.uid) {
          router.push("/tickets");
          return;
        }
        setTicket(t);
        setLoading(false);
      });
    });
    return () => unsub();
  }, [params.id, router]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-600 font-semibold">
        Chargement du ticket...
      </p>
    );

  if (!ticket || !ticket.event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Aucun ticket trouvé
          </h2>
          <p className="text-gray-600 mb-4">
            Aucun ticket n'a été trouvé pour cet identifiant ou vous n'y avez
            pas accès.
          </p>
          <Link href="/tickets" className="text-orange-600 underline">
            Retour à mes tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 space-y-8">
          {/* Navigation and Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/tickets"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à mes tickets
            </Link>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                <Download className="w-4 h-4" />
                <span className="text-sm">Enregistrer</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Partager</span>
              </button>
            </div>
          </div>

          {/* Event Info Summary */}
          <div
            className={`bg-white p-6 rounded-lg shadow-sm border ${
              ticket.event.is_cancelled ? "border-red-200" : "border-gray-100"
            }`}
          >
            <h1 className="text-2xl font-bold text-gray-900">
              {ticket.event.name}
            </h1>
            <p className="mt-1 text-gray-600">
              {new Date(ticket.event.eventDate).toLocaleDateString()} à{" "}
              {ticket.event.location}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ticket.event.is_cancelled
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {ticket.event.is_cancelled ? "Annulé" : "Ticket valide"}
              </span>
              <span className="text-sm text-gray-500">
                Acheté le {new Date(ticket.purchasedAt).toLocaleDateString()}
              </span>
            </div>
            {ticket.event.is_cancelled && (
              <p className="mt-4 text-sm text-red-600">
                Cet événement a été annulé. Un remboursement sera effectué si ce
                n'est pas déjà fait.
              </p>
            )}
          </div>
        </div>

        {/* Ticket Component */}
        {/* Ici on affiche un composant Ticket si tu en as un */}
        {ticket._id && <Ticket ticketId={ticket._id} />}

        {/* Additional Information */}
        <div
          className={`mt-8 rounded-lg p-4 ${
            ticket.event.is_cancelled
              ? "bg-red-50 border-red-100 border"
              : "bg-blue-50 border-blue-100 border"
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              ticket.event.is_cancelled ? "text-red-900" : "text-blue-900"
            }`}
          >
            Besoin d'aide ?
          </h3>
          <p
            className={`mt-1 text-sm ${
              ticket.event.is_cancelled ? "text-red-700" : "text-blue-700"
            }`}
          >
            {ticket.event.is_cancelled
              ? "Pour toute question concernant les remboursements ou annulations, contactez notre support à team@papareact-tickr.com"
              : "Pour tout problème avec votre ticket, contactez notre support à team@papareact-tickr.com"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Simulation d'une récupération de ticket (remplace par ton fetch Firestore / API Firebase)
async function fetchTicket(ticketId: string): Promise<TicketData | null> {
  // Simule un ticket "authentifié"
  if (ticketId === "demo-ticket") {
    return {
      _id: "demo-ticket",
      userId: "demo-user",
      purchasedAt: Date.now() - 3 * 24 * 3600 * 1000,
      event: {
        name: "Festival de musique",
        eventDate: Date.now() + 7 * 24 * 3600 * 1000,
        location: "Casablanca",
        is_cancelled: false,
      },
    };
  }
  return null;
}
