"use client";

import EventForm from "@/components/EventForm";
import { AlertCircle } from "lucide-react";

// Simule un événement pour affichage dans le formulaire
const fakeEvent = {
  id: "event123",
  name: "Concert de Rema",
  description: "Le premier concert de Rema à Casablanca !",
  location: "Casablanca Arena",
  eventDate: "2025-07-15",
  price: 49.99,
  totalTickets: 1000,
  soldTickets: 350,
};

export default function EditEventPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Modifier l'événement</h2>
          <p className="text-blue-100 mt-2">
            Mettez à jour les informations de votre événement
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                Note : Vous ne pouvez pas réduire le nombre total de billets
                en dessous de ceux déjà vendus.
              </p>
            </div>
          </div>

          <EventForm mode="edit" initialData={fakeEvent} />
        </div>
      </div>
    </div>
  );
}
