"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import signInImage from "@/public/images/organisateur.jpg";

export default function PartnerSignUpPage() {
  // You can add form state and logic here as needed
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left: Registration Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-custom-orange text-center">
              Inscription Partenaire
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  placeholder="Votre entreprise"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  placeholder="Email professionnel"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Mot de passe</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  placeholder="Mot de passe"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  placeholder="Confirmer le mot de passe"
                />
              </div>
              <Button className="w-full bg-custom-orange hover:bg-red-600 text-white">
                S'inscrire
              </Button>
            </form>
            <div className="w-full flex flex-col gap-4 mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">
                    Ou continuer avec
                  </span>
                </div>
              </div>
              <Button className="w-full bg-custom-orange">
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="white"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Continuer avec Google
              </Button>
            </div>
            <p className="mt-4 text-center">
              Vous avez déjà un compte ?{" "}
              <Link href="/sign-in">
                <span className="text-sm text-custom-orange font-bold cursor-pointer hover:underline">
                  connectez-vous ici
                </span>
              </Link>
            </p>
          </div>
        </div>
        {/* Right: Partner Info/Visual */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50">
          <div className="max-w-md text-center">
            <h3 className="font-bold text-2xl mb-4">
              Partenaires &amp; Organisateurs
            </h3>
            <p className="text-slate-400 mb-8 text-center">
              Rejoignez Cas@Event pour promouvoir vos événements, activités ou
              restaurants et gérer vos réservations facilement.
            </p>
            <div>
              <Image
                src={signInImage}
                alt="Image partenaire"
                width={536}
                height={728}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-custom-orange py-2 text-white">
        <ul className="flex justify-center items-center gap-6 text-sm">
          <li>
            <Link href="#" className="text-white hover:underline">
              © 2025 Cas@Event
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Confidentialité
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Conditions générales
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Plan du site
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Fonctionnement du site
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Infos sur l'entreprise
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
