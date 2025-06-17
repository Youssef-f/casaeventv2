"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";
import { getAuth } from "firebase/auth";

export default function ReleaseTicket({
  eventId,
  waitingListId,
}: {
  eventId: string;
  waitingListId: string;
}) {
  const [isReleasing, setIsReleasing] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  // Fonction simulée pour libérer le ticket (à remplacer par ta logique Firebase)
  async function libererTicket() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(
          `Ticket libéré pour eventId=${eventId}, waitingListId=${waitingListId}, userId=${user?.uid}`
        );
        resolve();
      }, 1000);
    });
  }

  const handleRelease = async () => {
    if (!confirm("Êtes-vous sûr de vouloir libérer votre offre de ticket ?")) return;

    try {
      setIsReleasing(true);
      await libererTicket();
      alert("Offre de ticket libérée !");
    } catch (error) {
      console.error("Erreur lors de la libération du ticket :", error);
      alert("Échec de la libération du ticket.");
    } finally {
      setIsReleasing(false);
    }
  };

  if (!user) return <p>Veuillez vous connecter pour libérer votre offre de ticket.</p>;

  return (
    <button
      onClick={handleRelease}
      disabled={isReleasing}
      className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <XCircle className="w-4 h-4" />
      {isReleasing ? "Libération en cours..." : "Libérer l'offre de ticket"}
    </button>
  );
}
