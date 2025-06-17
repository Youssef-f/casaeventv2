"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UserTypePage() {
  const [selectedType, setSelectedType] = useState<"visitors" | "partners">("visitors");

  return (
    <div className="w-full bg-white flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-4xl flex flex-col items-center">

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center mb-10">
          Sélectionner le type d'utilisateur
        </h1>

        {/* Cards */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center w-full mb-10">
          {/* Visitors */}
          <div
            className={`relative cursor-pointer transition-all duration-300 rounded-xl w-full max-w-xs ${
              selectedType === "visitors"
                ? "ring-4 ring-custom-orange shadow-xl scale-105"
                : "hover:ring-2 hover:ring-custom-orange"
            }`}
            onClick={() => setSelectedType("visitors")}
          >
            <div className="border rounded-xl bg-white overflow-hidden">
              <div className="relative w-full h-[400px]">
                <Image
                  src="/images/velo.jpeg"
                  alt="Deux personnes à vélo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-center">Visiteurs & Touristes</h3>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div
            className={`relative cursor-pointer transition-all duration-300 rounded-xl w-full max-w-xs ${
              selectedType === "partners"
                ? "ring-4 ring-custom-orange shadow-xl scale-105"
                : "hover:ring-2 hover:ring-custom-orange"
            }`}
            onClick={() => setSelectedType("partners")}
          >
            <div className="border rounded-xl bg-white overflow-hidden">
              <div className="relative w-full h-[400px] bg-black">
                <Image
                  src="/images/jazzablanca.jpg"
                  alt="Jazzablanca 2024"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-center">Partenaires</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/welcome">
            <Button
              variant="outline"
              className="w-32 border-custom-orange text-custom-orange hover:bg-custom-orange hover:text-white"
            >
              Retour
            </Button>
          </Link>
          <Link href={selectedType === "visitors" ? "/sign-up" : "/partner-signup"}>
            <Button className="w-32 bg-custom-orange hover:bg-red-600 text-white">
              Suivant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
