"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase"; // ton export firebase auth
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CalendarDays, Cog, Plus } from "lucide-react";
import Link from "next/link";
import Spinner from "./Spinner";

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

  // Simuler l’état compte Stripe
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);

      // Simuler la récupération du statut Stripe quand user est connecté
      if (firebaseUser) {
        fetchAccountStatus();
      }
    });

    return () => unsubscribe();
  }, []);

  // Simule la récupération de statut Stripe (à remplacer par ta logique réelle)
  const fetchAccountStatus = () => {
    setAccountStatus({
      isActive: true,
      chargesEnabled: true,
      payoutsEnabled: true,
      requiresInformation: false,
      requirements: { currently_due: [], eventually_due: [] },
    });
  };

  if (loadingUser) return <Spinner />;

  if (!user)
    return (
      <div className="p-6 text-center">
        <p className="mb-4">Vous devez être connecté pour accéder au tableau de bord vendeur.</p>
        <Link href="/sign-in" className="text-orange-600 underline">
          Se connecter
        </Link>
      </div>
    );

  const isReadyToAcceptPayments = accountStatus?.isActive && accountStatus?.payoutsEnabled;

  const handleManageAccount = () => {
    // Simuler redirection vers Stripe Dashboard
    alert("Redirection vers le tableau de bord Stripe (simulation)");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Section en-tête */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Tableau de bord vendeur</h2>
          <p className="text-orange-100 mt-2">
            Gérez votre profil vendeur et les paramètres de paiement
          </p>
        </div>

        {/* Contenu principal */}
        {isReadyToAcceptPayments && (
          <>
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Vendez des billets pour vos événements
              </h2>
              <p className="text-gray-600 mb-8">
                Listez vos billets à la vente et gérez vos annonces
              </p>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-center gap-4">
                  <Link
                    href="/seller/new-event"
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Créer un événement
                  </Link>
                  <Link
                    href="/seller/events"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <CalendarDays className="w-5 h-5" />
                    Voir mes événements
                  </Link>
                </div>
              </div>
            </div>

            <hr className="my-8" />
          </>
        )}

        <div className="p-6">
          {/* Section création de compte */}
          {!accountStatus && !accountCreatePending && (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">Commencez à accepter les paiements</h3>
              <p className="text-gray-600 mb-6">
                Créez votre compte vendeur pour commencer à recevoir des paiements en toute sécurité via Stripe
              </p>
              <button
                onClick={async () => {
                  setAccountCreatePending(true);
                  setError(false);
                  try {
                    // Simuler la création du compte Stripe
                    await new Promise((r) => setTimeout(r, 2000));
                    fetchAccountStatus();
                    setAccountCreatePending(false);
                  } catch (error) {
                    console.error("Erreur lors de la création du compte Stripe :", error);
                    setError(true);
                    setAccountCreatePending(false);
                  }
                }}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Créer mon compte vendeur
              </button>
            </div>
          )}

          {/* Section statut du compte */}
          {accountStatus && (
            <div className="space-y-6">
              {/* Cartes de statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Statut du compte */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Statut du compte</h3>
                  <div className="mt-2 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        accountStatus.isActive ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-lg font-semibold">
                      {accountStatus.isActive ? "Actif" : "Configuration en attente"}
                    </span>
                  </div>
                </div>

                {/* Statut des paiements */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Capacité de paiement</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.chargesEnabled ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.chargesEnabled ? "Peut accepter les paiements" : "Ne peut pas encore accepter les paiements"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.payoutsEnabled ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.payoutsEnabled ? "Peut recevoir les paiements" : "Ne peut pas encore recevoir les paiements"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section des informations requises */}
              {accountStatus.requiresInformation && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-3">Informations requises</h3>
                  {accountStatus.requirements.currently_due.length > 0 && (
                    <div className="mb-3">
                      <p className="text-yellow-800 font-medium mb-2">Action requise :</p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.currently_due.map((req) => (
                          <li key={req}>{req.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {accountStatus.requirements.eventually_due.length > 0 && (
                    <div>
                      <p className="text-yellow-800 font-medium mb-2">Besoins éventuels :</p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.eventually_due.map((req) => (
                          <li key={req}>{req.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-3 mt-6">
                {accountStatus.isActive && (
                  <button
                    onClick={handleManageAccount}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                  >
                    <Cog className="w-4 h-4 mr-2" />
                    Tableau de bord vendeur
                  </button>
                )}
                <button
                  onClick={fetchAccountStatus}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Rafraîchir le statut
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg">
                  Impossible d’accéder au tableau de bord Stripe. Veuillez d’abord compléter toutes les informations requises.
                </div>
              )}
            </div>
          )}

          {/* États de chargement */}
          {accountCreatePending && (
            <div className="text-center py-4 text-gray-600">
              Création de votre compte vendeur...
            </div>
          )}
          {accountLinkCreatePending && (
            <div className="text-center py-4 text-gray-600">
              Préparation de la configuration du compte...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
