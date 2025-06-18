"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";
import dynamic from 'next/dynamic';


import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase"; // chemin vers ta config Firebase

export default function EventDetail() {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">Chargement de la carte...</div>
    </div>
  )
});

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
      "Célébrons exceptionnellement à Casablanca ! Pour la première fois au Maroc, le superstar nigérian Rema, l'icône musicale de l'Afrobeat, se produit à Casablanca dans le cadre de sa tournée mondiale Rave & Roses World Tour 2025 ! Découvrez les rythmes de tous, l'amour et l'émotion, Soyez là ! « Calm Down » en direct avec Selena Gomez, le phénomène sur la scène internationale, Dumebi, Soundgasm, Woman, et bien d'autres. Préparez-vous à vivre une soirée inoubliable avec les plus grands hits de Rema. Rejoignez-nous le 13 juin 2025 au Morocco Mall de Casablanca pour une soirée musicale ! Places limitées - réservez vite vos billets !",
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
      venue: "@ Morocco Mall",
      date: "13 juin 2025 à 20:00",
      doorTime: "Ouverture des portes à 19:00",
      rating: 4.0,
      reviewsCount: 7,
      img: event.posterUrl,
    },
    {
      key: "golden",
      title: "Golden Access",
      price: 800,
      venue: "@ Morocco Mall",
      date: "13 juin 2025 à 20:00",
      doorTime: "Ouverture des portes �� 19:00",
      rating: 4.5,
      reviewsCount: 14,
      img: event.posterUrl,
    },
    {
      key: "vip",
      title: "VIP Experience",
      price: 1800,
      venue: "@ Morocco Mall",
      date: "13 juin 2025 à 20:00",
      doorTime: "Ouverture des portes à 19:00",
      rating: 5.0,
      reviewsCount: 23,
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

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        className={`${
          index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : index < rating
            ? "fill-yellow-200 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const totalTickets = Object.values(ticketsCount).reduce((a, b) => a + b, 0);

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

      {/* TICKETS SECTION - Exact Design Match */}
      <section className="max-w-7xl mx-auto mt-12 px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Event Poster */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-[400px]">
                <Image
                  src={event.posterUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    {new Date(event.eventDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-base">📍</span>
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-base">🕘</span>
                    {new Date(event.eventDate).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Ticket Selection */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Event Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Choisissez vos tickets</h2>

            

              {/* Ticket Cards */}
              <div className="space-y-4 mb-8">
                {tickets.map(({ key, title, price, venue, date, doorTime, rating, reviewsCount, img }) => (
                  <div
                    key={key}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex gap-4">
                      {/* Ticket Thumbnail */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={img}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Ticket Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1">{title}</h4>
                            <p className="text-sm text-gray-600">{venue}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-gray-900">
                              {price.toLocaleString("fr-FR")} MAD
                            </span>
                            <p className="text-xs text-gray-500">par billet</p>
                          </div>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <p className="font-medium">{date}</p>
                          <p>{doorTime}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {rating.toFixed(1)}
                            </span>
                            <div className="flex">
                              {renderStars(rating)}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({reviewsCount} Reviews)
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => decrement(key)}
                              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors border border-gray-300"
                              aria-label={`Réduire ${title}`}
                            >
                              <Minus size={16} className="text-gray-600" />
                            </button>
                            <span className="w-12 text-center font-bold text-lg text-gray-900">
                              {ticketsCount[key]}
                            </span>
                            <button
                              onClick={() => increment(key)}
                              className="w-10 h-10 rounded-full bg-[#FF5A1F] hover:bg-red-600 flex items-center justify-center transition-colors shadow-sm"
                              aria-label={`Augmenter ${title}`}
                            >
                              <Plus size={16} className="text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Purchase Button */}
              <div className="border-t border-gray-200 pt-6">
                {!user && (
                  <Link href="/sign-in">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 text-lg">
                      Connectez-vous pour acheter vos billets
                    </button>
                  </Link>
                )}

                {user && (
                  <button
                    className="w-full bg-[#FF5A1F] hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() =>
                      alert(
                        `Achat simulé : ${JSON.stringify(ticketsCount, null, 2)} billets`
                      )
                    }
                    disabled={totalTickets === 0}
                  >
                    <ShoppingCart size={20} />
                    Acheter {totalTickets > 0 && `(${totalTickets} billet${totalTickets > 1 ? 's' : ''})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* MAP SECTION */}

{/* PLAN ET LOCALISATION */}
<section className="max-w-7xl mx-auto mt-16 px-6">
  <h2 className="text-3xl font-bold text-[#FF5A1F] mb-10 text-center">
    Plan de la salle & Localisation
  </h2>

  <div className="grid md:grid-cols-2 gap-8">
    {/* Plan de la salle */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan de la salle</h3>
        <div className="relative h-[400px] bg-white">
          <Image
            src="/images/carte-rema-salle.jpg"
            alt="Plan de la salle - Disposition des places"
            fill
            className="object-contain"
          />
          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-lg text-sm font-medium text-gray-600 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
              <span>VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <span>Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Carte interactive */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
        <div className="relative">
          <LocationMap
            center={[33.5731, -7.5898]} // Coordonnées de Casablanca
            price="1200 MAD"
          />
          <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-sm font-medium text-gray-600 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-pulse"></div>
              <span>Morocco Mall, Casablanca</span>
            </div>
          </div>
        </div>
      </div>
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
          <div className="bg-white p-8 rounded-xl shadow-lg max-h-[420px] overflow-y-auto">
            <h3 className="font-semibold mb-6 text-lg">Commentaires</h3>
            <textarea
              placeholder="Donnez votre avis..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent"
              rows={3}
            />
            <button className="bg-[#FF5A1F] text-white font-bold w-full py-3 rounded-lg hover:bg-red-600 transition-colors">
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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                className="w-full p-3 rounded-lg text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="w-full bg-white text-[#FF5A1F] font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
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