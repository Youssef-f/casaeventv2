"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import EventForm from "@/components/EventForm";

// Données simulées pour le front uniquement
const mockEventData = {
  title: "Concert de Jazz",
  date: "2025-07-01",
  location: "Casablanca - Parc de la Ligue Arabe",
  description: "Un événement musical inoubliable sous les étoiles.",
};

export default function EditEventPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    // Simule une récupération de données via l'id
    if (params.id) {
      // Ici tu peux plus tard intégrer Firebase ou API
      setEvent(mockEventData);
    }
  }, [params.id]);

  if (!event) return <p className="text-center mt-10 text-gray-500">Chargement...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Modifier l'événement</h2>
          <p className="text-orange-100 mt-2">Mettez à jour les détails de votre événement</p>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                <strong>Note :</strong> si vous modifiez le nombre total de billets, les billets déjà
                vendus resteront valides. Vous pouvez uniquement augmenter ce nombre, pas le diminuer
                en dessous du nombre de billets déjà vendus.
              </p>
            </div>
          </div>

          <EventForm mode="edit" initialData={event} />
        </div>
      </div>
    </div>
  );
}
