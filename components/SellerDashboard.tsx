"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CalendarDays, Cog, Plus } from "lucide-react";
import Link from "next/link";
import Spinner from "./Spinner";
import { Button } from "@/components/ui/button";

type AccountStatus = {
  isActive: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  requiresInformation: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
  };
};

export default function SellerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const [reservations, setReservations] = useState([
    { id: 1, clientName: "John Doe", status: "pending" },
    { id: 2, clientName: "Jane Smith", status: "confirmed" },
  ]);

  const [reviews] = useState([
    { id: 1, clientName: "Emma", rating: 5, comment: "Une expérience incroyable!" },
    { id: 2, clientName: "Liam", rating: 4, comment: "Tout était parfait!" },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);
      if (firebaseUser) fetchAccountStatus();
    });
    return () => unsubscribe();
  }, []);

  const fetchAccountStatus = () => {
    // Simulation d’appel API Stripe
    setAccountStatus({
      isActive: true,
      chargesEnabled: true,
      payoutsEnabled: true,
      requiresInformation: false,
      requirements: { currently_due: [], eventually_due: [] },
    });
  };

  const handleConfirm = (id: number) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, status: "confirmed" } : res
    ));
  };

  const handleCancel = (id: number) => {
    setReservations(reservations.filter(res => res.id !== id));
  };

  const handleManageAccount = () => {
    alert("Redirection vers le tableau de bord Stripe (simulation)");
  };

  if (loadingUser) return <Spinner />;

  if (!user)
    return (
      <div className="p-6 text-center">
        <p className="mb-4">Vous devez être connecté pour accéder au tableau de bord vendeur.</p>
        <Link href="/sign-in" className="text-orange-600 underline">Se connecter</Link>
      </div>
    );

  return (
    <div className="flex min-h-screen">
      {/* Navigation latérale */}
      <aside className="w-1/4 bg-orange-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Cas@Event</h2>
        <ul className="space-y-3">
          <li><a href="#" className="block">Tableau de bord</a></li>
          <li><a href="#" className="block">Annonces</a></li>
          <li><a href="#" className="block">Réservations</a></li>
          <li><a href="#" className="block">Avis</a></li>
          <li><a href="#" className="block">Statistiques</a></li>
        </ul>
      </aside>

      {/* Contenu principal */}
      <main className="w-3/4 p-8 space-y-10">
        <header>
          <h1 className="text-3xl font-bold">Bienvenue sur votre tableau de bord vendeur</h1>
        </header>

        {/* Paiements */}
        <section>
          <div className="bg-white p-6 rounded-lg shadow">
            {accountStatus ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Statut des paiements</h2>
                <p className="mb-2">
                  Compte : <strong>{accountStatus.isActive ? "Actif" : "Inactif"}</strong>
                </p>
                <p className="mb-2">
                  Accepte les paiements :{" "}
                  {accountStatus.chargesEnabled ? "✔️ Oui" : "❌ Non"}
                </p>
                <p className="mb-4">
                  Peut recevoir les virements :{" "}
                  {accountStatus.payoutsEnabled ? "✔️ Oui" : "❌ Non"}
                </p>
                <Button onClick={handleManageAccount}>
                  <Cog className="w-4 h-4 mr-2" /> Gérer mon compte Stripe
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Créer un compte vendeur</h2>
                <Button
                  onClick={async () => {
                    setAccountCreatePending(true);
                    await new Promise((r) => setTimeout(r, 2000));
                    fetchAccountStatus();
                    setAccountCreatePending(false);
                  }}
                >
                  Créer mon compte vendeur
                </Button>
              </>
            )}
            {accountCreatePending && <p className="text-gray-500 mt-4">Création en cours...</p>}
            {error && <p className="text-red-500 mt-2">Erreur de création du compte Stripe</p>}
          </div>
        </section>

        {/* Réservations */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Réservations clients</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {reservations.map((res) => (
              <div key={res.id} className="flex justify-between items-center border-b py-2">
                <span>{res.clientName}</span>
                <div>
                  {res.status === "pending" ? (
                    <>
                      <Button onClick={() => handleConfirm(res.id)} className="mr-2">Confirmer</Button>
                      <Button onClick={() => handleCancel(res.id)} variant="destructive">Annuler</Button>
                    </>
                  ) : (
                    <span className="text-green-600">Confirmé</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Avis */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Avis des clients</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b py-2">
                <div className="flex justify-between">
                  <span>{review.clientName}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                </div>
                <p>{review.comment}</p>
                <Button className="mt-2">Répondre</Button>
              </div>
            ))}
          </div>
        </section>

        {/* Statistiques */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
          <div className="bg-white rounded-lg shadow p-4 space-y-2">
            <p>Total réservations : {reservations.length}</p>
            <p>Confirmées : {reservations.filter(r => r.status === "confirmed").length}</p>
            <p>En attente : {reservations.filter(r => r.status === "pending").length}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
