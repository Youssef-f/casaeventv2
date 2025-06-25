"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Annonce = {
  id: number;
  type: string;
  titre: string;
  date?: string;
};

const initialAnnonces: Annonce[] = [
  { id: 1, type: "Activité", titre: "Cours de yoga", date: "15/05/2024" },
  {
    id: 2,
    type: "Événement",
    titre: "Concert en plein air",
    date: "20/05/2024",
  },
  { id: 3, type: "Restaurant", titre: "La Table Marocaine" }, // sans date
];

export default function AnnonceManager() {
  const [annonces, setAnnonces] = useState(initialAnnonces);
  const router = useRouter();

  const handleDelete = (id: number) => {
    setAnnonces(annonces.filter((a) => a.id !== id));
  };

  const handleEdit = (id: number) => {
    alert(`Modifier l'annonce ID ${id}`);
  };

  const handleCreate = () => {
    router.push("/seller/new-event");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des annonces</h1>
        <Button
          onClick={handleCreate}
          className="bg-orange-600 text-white hover:bg-orange-700"
        >
          + Créer
        </Button>
      </div>
      <p className="text-gray-600 mb-4">
        Création, modification et suppression d'activités, d'événements et de
        restaurants.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Titre</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-center px-4 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {annonces.map((annonce) => (
              <tr key={annonce.id} className="border-t">
                <td className="px-4 py-2">{annonce.type}</td>
                <td className="px-4 py-2">{annonce.titre}</td>
                <td className="px-4 py-2">{annonce.date || "—"}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="default"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3"
                      onClick={() => handleEdit(annonce.id)}
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="ml-1 hidden sm:inline">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => handleDelete(annonce.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
