"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/casaeventlogo.png";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase"; // chemin vers ta config Firebase

export default function EventDetail() {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);


  // Exemple données statiques
  const event = {
    id: "rema2025",
    name: "Rema World Tour 2025",
    description:
      "Pour la première fois au Maroc, le superstar nigérian Rema en concert exceptionnel à Casablanca. Ambiance garantie au Morocco Mall !",
    eventDate: "2025-06-13T21:00:00Z",
    location: "Morocco Mall",
    price: 400,
    imageUrl: "/images/Rema-panorama.png",
    posterUrl: "/images/rema.jpg",
    availability: { totalTickets: 1000, purchasedCount: 200 },
  };

  const tickets = [
    {
      key: "standard",
      title: "Standard Pass",
      price: 400,
      desc: event.location,
      date: "13 juin 2025 à 21:00",
      details: "Ouverture des portes 19:00",
      img: event.posterUrl,
    },
    {
      key: "golden",
      title: "Golden Access",
      price: 800,
      desc: event.location,
      date: "13 juin 2025 à 21:00",
      details: "Ouverture des portes 19:00",
      img: event.posterUrl,
    },
    {
      key: "vip",
      title: "VIP Experience",
      price: 1800,
      desc: event.location,
      date: "13 juin 2025 à 21:00",
      details: "Ouverture des portes 19:00",
      img: event.posterUrl,
    },
  ];

  const [ticketsCount, setTicketsCount] = useState<Record<string, number>>({
    standard: 0,
    golden: 0,
    vip: 0,
  });

  const increment = (key: string) => {
    setTicketsCount((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const decrement = (key: string) => {
    setTicketsCount((prev) => ({
      ...prev,
      [key]: prev[key] > 0 ? prev[key] - 1 : 0,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
  

      {/* HERO */}
      <section className="relative bg-white max-w-7xl mx-auto mt-8 rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row">
        {/* Image large */}
        <div className="relative md:flex-1 h-64 md:h-auto">
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Texte côté droit */}
        <div className="md:flex-1 p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-[#FF5A1F] mb-4">{event.name}</h1>
          <p className="text-gray-700 mb-6 leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-2 gap-4 text-gray-700 font-medium">
            <div>
              <span className="block text-sm uppercase text-gray-400 mb-1">
                Date
              </span>
              {new Date(event.eventDate).toLocaleString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div>
              <span className="block text-sm uppercase text-gray-400 mb-1">
                Lieu
              </span>
              {event.location}
            </div>
            <div>
              <span className="block text-sm uppercase text-gray-400 mb-1">
                Prix à partir de
              </span>
              <span className="text-xl font-semibold text-[#FF5A1F]">
                {event.price.toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div>
              <span className="block text-sm uppercase text-gray-400 mb-1">
                Places restantes
              </span>
              <span className="font-semibold">
                {event.availability.totalTickets -
                  event.availability.purchasedCount}{" "}
                / {event.availability.totalTickets}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section className="max-w-7xl mx-auto mt-12 px-6">
        <h2 className="text-3xl font-bold text-center text-[#FF5A1F] mb-10">
          Choisissez vos billets
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {tickets.map(({ key, title, price, desc, date, details, img }) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col"
            >
              <div className="relative w-full h-40 rounded-md overflow-hidden mb-4">
                <Image
                  src={img}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={key === "standard"}
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <p className="text-gray-500 text-sm mb-2">{desc}</p>
              <p className="text-gray-500 text-sm mb-2">{date}</p>
              <p className="text-gray-400 text-sm mb-4">{details}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#FF5A1F] font-bold text-lg">
                  {price.toLocaleString("fr-FR")} MAD
                </span>

                {/* Quantité */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => decrement(key)}
                    aria-label={`Réduire ${title}`}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold">
                    {ticketsCount[key]}
                  </span>
                  <button
                    onClick={() => increment(key)}
                    aria-label={`Augmenter ${title}`}
                    className="bg-[#FF5A1F] text-white px-3 py-1 rounded hover:bg-[#e55313] transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton achat */}
        <div className="max-w-md mx-auto mt-10">
          {!user && (
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-lg shadow-lg transition">
                Connectez-vous pour acheter vos billets
              </Button>
            </Link>
          )}

          {user && (
            <Button
              className="w-full bg-[#FF5A1F] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-[#e55313] transition"
              onClick={() =>
                alert(
                  `Achat simulé : ${JSON.stringify(ticketsCount, null, 2)} billets`
                )
              }
              disabled={
                Object.values(ticketsCount).reduce((a, b) => a + b, 0) === 0
              }
            >
              Acheter maintenant
            </Button>
          )}
        </div>
      </section>

      {/* PLAN ET LOCALISATION */}
      <section className="max-w-7xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold text-[#FF5A1F] mb-10 text-center">
          Plan de la salle & Localisation
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Image
              src="/images/carte-rema-salle.jpg"
              alt="Plan de la salle"
              width={800}
              height={400}
              className="object-cover"
            />
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Image
              src="/images/map-casablanca.png"
              alt="Carte Casablanca"
              width={600}
              height={400}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* AVIS & VIDEO */}
      <section className="max-w-7xl mx-auto mt-16 px-6 mb-24">
        <h2 className="text-3xl font-bold text-[#FF5A1F] mb-10 text-center">
          Votre avis & vidéo officielle
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Commentaires */}
          <div className="bg-white p-8 rounded-lg shadow-md max-h-[420px] overflow-y-auto">
            <h3 className="font-semibold mb-6 text-lg">Commentaires</h3>
            <textarea
              placeholder="Donnez votre avis..."
              className="w-full p-3 border border-gray-300 rounded resize-none mb-4"
              rows={3}
            />
            <button className="bg-[#FF5A1F] text-white font-bold w-full py-3 rounded hover:bg-[#e55313] transition">
              Commenter
            </button>

            <ul className="mt-6 space-y-4 text-gray-700 text-sm">
              <li>
                <strong>Benk Taleb</strong> <em className="text-gray-400">il y a 3 minutes</em>
                <p>Au top, c'était fantastique le gars !</p>
              </li>
              <li>
                <strong>Adam Plume</strong> <em className="text-gray-400">il y a 9 minutes</em>
                <p>Vivement le Morocco Festival !</p>
              </li>
              <li>
                <strong>Malik Enjoy</strong> <em className="text-gray-400">il y a 1 heure</em>
                <p>Really nice vibes, loved it... on ne peut pas rater Rema (lol)</p>
              </li>
              <li>
                <strong>Huda Nacer</strong> <em className="text-gray-400">il y a 2 heures</em>
                <p>Pour la 1ère fois au Maroc, Trop cool !</p>
              </li>
            </ul>
          </div>

          {/* Vidéo */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <video
              src="/videos/Rema-Calm-Down-Video.mp4"
              controls
              className="w-full h-full max-h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FF5A1F] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Cas@Event</h4>
            <p className="mb-4 max-w-xs">
              Découvrez et réservez les meilleurs événements et activités à
              Casablanca.
            </p>
            <div className="flex space-x-4 text-lg">
              <Link href="#">
                <span className="hover:underline cursor-pointer">FB</span>
              </Link>
              <Link href="#">
                <span className="hover:underline cursor-pointer">IN</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Activités
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Concerts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Dîners
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Family
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <form>
              <input
                type="email"
                placeholder="Votre adresse email"
                className="w-full p-3 rounded text-gray-900 mb-3"
              />
              <button
                type="submit"
                className="w-full bg-white text-[#FF5A1F] font-bold py-3 rounded hover:bg-gray-100 transition"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-10 text-sm opacity-90">
          © 2025 Cas@Event. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}