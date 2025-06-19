"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "En attente" | "Confirmé" | "Annulé";

type Reservation = {
  id: number;
  name: string;
  passType: string;
  status: Status;
  datetime: string;
};

const allReservations: Reservation[] = [
  { id: 1, name: "Jean Dupont", passType: "VIP Experience", status: "En attente", datetime: "15/05/2024, 20:00" },
  { id: 2, name: "Marie Lambert", passType: "Standard Pass", status: "Confirmé", datetime: "10/05/2024, 18:30" },
  { id: 3, name: "Pierre Martin", passType: "Golden Pass", status: "Annulé", datetime: "08/05/2024, 14:00" },
  { id: 4, name: "Sophie Richard", passType: "Standard Pass", status: "Confirmé", datetime: "05/05/2024, 16:00" },
];

export default function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>(allReservations);
  const [filter, setFilter] = useState<Status | "Tous">("Tous");

  const updateStatus = (id: number, newStatus: Status) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredReservations =
    filter === "Tous" ? reservations : reservations.filter((r) => r.status === filter);

  const exportCSV = () => {
    const csvContent =
      "Nom,Type de pass,Statut,Date / heure\n" +
      filteredReservations
        .map((r) => `${r.name},${r.passType},${r.status},${r.datetime}`)
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "reservations.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des réservations</h1>
        <div className="flex gap-2">
          <Button onClick={exportCSV} className="bg-orange-600 hover:bg-orange-700 text-white">
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 mb-4">
        {["Tous", "En attente", "Confirmé", "Annulé"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status as Status | "Tous")}
          >
            {status}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Type de pass</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Date / heure</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res.id} className="border-t">
                <td className="px-4 py-3">{res.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                      res.passType === "Standard Pass"
                        ? "bg-green-100 text-green-800"
                        : res.passType === "VIP Experience"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {res.passType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-semibold ${
                      res.status === "Confirmé"
                        ? "text-green-600"
                        : res.status === "Annulé"
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="px-4 py-3">{res.datetime}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {res.status !== "Confirmé" && (
                    <Button
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => updateStatus(res.id, "Confirmé")}
                    >
                      Confirmer
                    </Button>
                  )}
                  {res.status !== "Annulé" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateStatus(res.id, "Annulé")}
                    >
                      Annuler
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
