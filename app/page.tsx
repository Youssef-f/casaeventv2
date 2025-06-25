"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Filter,
  Search,
  Star,
  Ticket,
} from "lucide-react";
import dynamic from "next/dynamic";
import Chatbot from "@/components/Chatbot/Chatbot";

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">Chargement de la carte...</div>
    </div>
  ),
});

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [nearbyFavorites, setNearbyFavorites] = useState<Set<number>>(
    new Set()
  );

  // Filter states
  const [filters, setFilters] = useState({
    typeActivite: "",
    typeEvenement: "",
    prix: "",
    date: "",
    heure: "",
    lieu: "",
  });

  const categories = ["Tous", "Activités", "Événements", "Restaurants"];

  const filterOptions = {
    typeActivite: [
      { value: "", label: "Tous les types" },
      { value: "sport", label: "Sport & Fitness" },
      { value: "culture", label: "Culture & Arts" },
      { value: "loisirs", label: "Loisirs & Détente" },
      { value: "restaurants", label: "Restaurants" },
    ],
    typeEvenement: [
      { value: "", label: "Tous les événements" },
      { value: "concert", label: "Concerts" },
      { value: "festival", label: "Festivals" },
      { value: "spectacle", label: "Spectacles" },
      { value: "conference", label: "Conférences" },
    ],
    prix: [
      { value: "", label: "Tous les prix" },
      { value: "0-100", label: "0 - 100 MAD" },
      { value: "100-500", label: "100 - 500 MAD" },
      { value: "500-1000", label: "500 - 1000 MAD" },
      { value: "1000+", label: "1000+ MAD" },
    ],
    heure: [
      { value: "", label: "Toute la journée" },
      { value: "matin", label: "Matin (6h-12h)" },
      { value: "apres-midi", label: "Après-midi (12h-18h)" },
      { value: "soir", label: "Soir (18h-24h)" },
    ],
    lieu: [
      { value: "", label: "Tous les lieux" },
      { value: "centre-ville", label: "Centre-ville" },
      { value: "ain-diab", label: "Ain Diab" },
      { value: "maarif", label: "Maarif" },
      { value: "bourgogne", label: "Bourgogne" },
      { value: "gironde", label: "Gironde" },
      { value: "abdelmoumen", label: "Abdelmoumen" },
      { value: "anfa", label: "Anfa" },
    ],
  };

  const events = [
    {
      id: 1,
      title: "Samedi 21 Juin (Gay Concert) - Gims",
      location: "La Casablancaise",
      date: "Parc de la ligue Arabe",
      time: "21 Juin 2025 à 14:00",
      price: "600 MAD",
      image: "/images/gims.jpg",
      category: "Événements",
    },
    {
      id: 2,
      title: "CASANOLA - Festival de Jazz",
      location: "Automobile Club du Maroc",
      date: "Casablanca",
      time: "Du 12 Juin Au 14 Juin",
      price: "950 MAD",
      image: "/images/casanola.jpg",
      category: "Événements",
    },
    {
      id: 3,
      title: "REMA WORLD TOUR",
      location: "Morocco Mall",
      date: "13 Juin 2025 à 20:00",
      time: "Ouverture des portes à 16:00",
      price: "1200 MAD",
      image: "/images/rema.jpg",
      category: "Événements",
    },
    {
      id: 4,
      title: "Dream World",
      location: "Casablanca",
      date: "Boulevard Roudani",
      time: "31 Décembre à 18:00",
      price: "100 MAD",
      image: "/images/dream-world.jpg",
      category: "Activités",
    },
    {
      id: 5,
      title: "REMA WORLD TOUR",
      location: "Morocco Mall",
      date: "13 Juin 2025 à 20:00",
      time: "Ouverture des portes à 16:00",
      price: "400 MAD",
      image: "/images/rema.jpg",
      category: "Événements",
    },
    {
      id: 6,
      title: "Festival Mawazine 2025 - MIRYAM FARES",
      location: "Scène Nahda",
      date: "29 Juin 2025 à 22:00",
      time: "",
      price: "850 MAD",
      image: "/images/myriam.jpg",
      category: "Événements",
    },
    {
      id: 7,
      title: "Dream World",
      location: "Casablanca Boulevard Roudani",
      date: "31 Décembre à 18:00",
      time: "",
      price: "100 MAD",
      image: "/images/dream-world-2.jpg",
      category: "Activités",
    },
    {
      id: 8,
      title: "Samedi 21 Juin (Gay Concert) - Gims",
      location: "La Casablancaise",
      date: "Parc de la ligue Arabe",
      time: "21 Juin 2025 à 14:00",
      price: "600 MAD",
      image: "/images/gims.jpg",
      category: "Événements",
    },
  ];

  // Nearby events with detailed information
  const nearbyEvents = [
    {
      id: 101,
      title: "Mawazine - Concert Maître Gims",
      location: "La Casablancaise",
      address: "Parc de la ligue Arabe",
      date: "21 juin 2025 à 14:00",
      openingTime: "Ouverture des portes à 12:00",
      closingTime: "Fermeture des portes à 14:00",
      price: "600 MAD",
      pricePerPerson: "/pers",
      rating: 4.0,
      reviewsCount: 7,
      image: "/images/gims.jpg",
      position: [33.5731, -7.5898] as [number, number],
      category: "Concert",
    },
    {
      id: 102,
      title: "Rema World Tour 2025",
      location: "Morocco Mall",
      address: "Morocco Mall",
      date: "13 juin 2025 à 20:00",
      openingTime: "Ouverture des portes à 15:00",
      closingTime: "",
      price: "1200 MAD",
      pricePerPerson: "/pers",
      rating: 5.0,
      reviewsCount: 14,
      image: "/images/rema.jpg",
      position: [33.5584, -7.6707] as [number, number],
      category: "Concert",
    },
    {
      id: 103,
      title: "Festival Mawazine 2025 - MIRYAM FARES",
      location: "Casablanca",
      address: "Scène Nahda",
      date: "26 juin 2025 à 22:00",
      openingTime: "",
      closingTime: "",
      price: "860 MAD",
      pricePerPerson: "/pers",
      rating: 4.0,
      reviewsCount: 267,
      image: "/images/myriam.jpg",
      position: [33.5892, -7.6036] as [number, number],
      category: "Festival",
    },
  ];

  const [filteredEvents, setFilteredEvents] = useState(events);

  const toggleFavorite = (eventId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId);
    } else {
      newFavorites.add(eventId);
    }
    setFavorites(newFavorites);
  };

  const toggleNearbyFavorite = (eventId: number) => {
    const newFavorites = new Set(nearbyFavorites);
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId);
    } else {
      newFavorites.add(eventId);
    }
    setNearbyFavorites(newFavorites);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearch = () => {
    let result = events;
    if (filters.typeActivite) {
      result = result.filter((e) =>
        e.category.toLowerCase().includes(filters.typeActivite.toLowerCase())
      );
    }
    if (filters.typeEvenement) {
      result = result.filter((e) =>
        e.title.toLowerCase().includes(filters.typeEvenement.toLowerCase())
      );
    }
    if (filters.prix) {
      if (filters.prix === "0-100")
        result = result.filter(
          (e) => parseInt(e.price) >= 0 && parseInt(e.price) <= 100
        );
      if (filters.prix === "100-500")
        result = result.filter(
          (e) => parseInt(e.price) > 100 && parseInt(e.price) <= 500
        );
      if (filters.prix === "500-1000")
        result = result.filter(
          (e) => parseInt(e.price) > 500 && parseInt(e.price) <= 1000
        );
      if (filters.prix === "1000+")
        result = result.filter((e) => parseInt(e.price) > 1000);
    }
    if (filters.date) {
      result = result.filter((e) => e.date.includes(filters.date));
    }
    if (filters.heure) {
      result = result.filter(
        (e) =>
          e.time && e.time.toLowerCase().includes(filters.heure.toLowerCase())
      );
    }
    if (filters.lieu) {
      result = result.filter((e) =>
        e.location.toLowerCase().includes(filters.lieu.toLowerCase())
      );
    }
    setFilteredEvents(result);
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

  return (
    <main className="bg-[#F8F8F8] min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center">
        <Image
          src="/images/mosquee-hassan-2.jpg"
          alt="Casablanca"
          fill
          className="object-contain w-full h-full absolute top-0 left-0 z-0"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-black/30">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 text-center drop-shadow">
            Découvrez Casablanca
          </h1>
          <p className="text-lg md:text-2xl text-white mb-6 text-center drop-shadow">
            <span className="text-[#FF5A1F] font-bold">Cas@Event</span> est la
            solution pour découvrir et réserver des activités locales sur{" "}
            <span className="underline">Casablanca</span>.
          </p>
        </div>
      </section>

      {/* Enhanced Filter/Search Bar */}
      <section
        aria-label="Filtre des activités et événements"
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-6xl mx-auto mt-8"
      >
        {/* ... existing filter code ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
          {/* Type d'activité */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter size={16} className="text-[#FF5A1F]" />
              Type d'activité
            </label>
            <div className="relative">
              <select
                value={filters.typeActivite}
                onChange={(e) =>
                  handleFilterChange("typeActivite", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                {filterOptions.typeActivite.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* ... other filter fields ... */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-[#FF5A1F]" />
              Type d'événement
            </label>
            <div className="relative">
              <select
                value={filters.typeEvenement}
                onChange={(e) =>
                  handleFilterChange("typeEvenement", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                {filterOptions.typeEvenement.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <DollarSign size={16} className="text-[#FF5A1F]" />
              Prix
            </label>
            <div className="relative">
              <select
                value={filters.prix}
                onChange={(e) => handleFilterChange("prix", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                {filterOptions.prix.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-[#FF5A1F]" />
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent hover:border-gray-300 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock size={16} className="text-[#FF5A1F]" />
              Heure
            </label>
            <div className="relative">
              <select
                value={filters.heure}
                onChange={(e) => handleFilterChange("heure", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                {filterOptions.heure.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-[#FF5A1F]" />
              Lieu
            </label>
            <div className="relative">
              <select
                value={filters.lieu}
                onChange={(e) => handleFilterChange("lieu", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                {filterOptions.lieu.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSearch}
            className="bg-[#FF5A1F] hover:bg-red-600 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            <Search size={18} />
            Rechercher
          </button>
        </div>
      </section>

      {/* Add this section above the main event grid (after filters, before 'Nouveautés & Tendances du Mois') */}
      {favorites.size > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-left text-[#FF5A1F] flex items-center gap-2">
            <Heart size={24} className="fill-red-500 text-red-500" />
            Mes Favoris
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {events
              .filter((event) => favorites.has(event.id))
              .map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 group">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(event.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <Heart
                        size={16}
                        className={
                          favorites.has(event.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        }
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="text-xs text-gray-600 mb-3 space-y-1">
                      <p>{event.location}</p>
                      <p>{event.date}</p>
                      {event.time && <p>{event.time}</p>}
                    </div>
                    <div className="flex justify-center mb-3">
                      <span className="bg-[#FF5A1F] text-white px-3 py-1 rounded-full text-sm font-bold">
                        {event.price}
                      </span>
                    </div>
                    <Link
                      href={`/event/${event.id}`}
                      className="w-full block bg-[#FF5A1F] text-white py-2 rounded text-sm font-bold hover:bg-red-600 transition-colors text-center"
                    >
                      Acheter maintenant
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
      {favorites.size === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-left text-[#FF5A1F] flex items-center gap-2">
            <Heart size={24} className="text-gray-300" />
            Mes Favoris
          </h2>
          <div className="text-gray-500 text-center">
            Aucun favori pour le moment. Cliquez sur le cœur d'une activité pour
            l'ajouter ici !
          </div>
        </section>
      )}

      {/* Nouveautés & Tendances du Mois */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Nouveautés & Tendances du Mois</h2>
          <Link href="#" className="text-[#FF5A1F] font-semibold underline">
            Voir +
          </Link>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Add this nav bar above the event list: */}
        <div className="flex gap-8 font-semibold text-black dark:text-white justify-center text-lg md:text-xl my-8">
          <button
            onClick={() => setSelectedCategory("Tous")}
            className={
              selectedCategory === "Tous"
                ? "text-[#FF5A1F] underline"
                : "hover:underline"
            }
          >
            Accueil
          </button>
          <button
            onClick={() => setSelectedCategory("Événements")}
            className={
              selectedCategory === "Événements"
                ? "text-[#FF5A1F] underline"
                : "hover:underline"
            }
          >
            Événements
          </button>
          <button
            onClick={() => setSelectedCategory("Activités")}
            className={
              selectedCategory === "Activités"
                ? "text-[#FF5A1F] underline"
                : "hover:underline"
            }
          >
            Activités
          </button>
          <button
            onClick={() => setSelectedCategory("Restaurants")}
            className={
              selectedCategory === "Restaurants"
                ? "text-[#FF5A1F] underline"
                : "hover:underline"
            }
          >
            Restaurants
          </button>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredEvents
            .filter(
              (e) =>
                selectedCategory === "Tous" || e.category === selectedCategory
            )
            .map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image with Navigation Arrows and Heart */}
                <div className="relative h-48 group">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />

                  {/* Navigation Arrows */}
                  <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} />
                  </button>

                  {/* Heart Icon */}
                  <button
                    onClick={() => toggleFavorite(event.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <Heart
                      size={16}
                      className={`${
                        favorites.has(event.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="text-xs text-gray-600 mb-3 space-y-1">
                    <p>{event.location}</p>
                    <p>{event.date}</p>
                    {event.time && <p>{event.time}</p>}
                  </div>

                  {/* Price Badge */}
                  <div className="flex justify-center mb-3">
                    <span className="bg-[#FF5A1F] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {event.price}
                    </span>
                  </div>

                  <Link
                    href={`/event/${event.id}`}
                    className="w-full block bg-[#FF5A1F] text-white py-2 rounded text-sm font-bold hover:bg-red-600 transition-colors text-center"
                  >
                    Acheter maintenant
                  </Link>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5A1F]"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        </div>
      </section>

      {/* Enhanced Événements à proximité de vous */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold mb-6 text-left">
          Évènements à proximité de vous
        </h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Detailed Event Cards */}
          <div className="flex-1 space-y-6">
            {nearbyEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 relative"
              >
                {/* Heart Icon - Top Right */}
                <button
                  onClick={() => toggleNearbyFavorite(event.id)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <Heart
                    size={20}
                    className={`${
                      nearbyFavorites.has(event.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  />
                </button>

                <div className="flex gap-4">
                  {/* Event Image */}
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0 pr-8">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin
                        size={16}
                        className="text-[#FF5A1F] flex-shrink-0"
                      />
                      <span>{event.location}</span>
                    </div>

                    {/* Address */}
                    <p className="text-sm text-gray-500 mb-3">
                      {event.address}
                    </p>

                    {/* Date and Time */}
                    <div className="text-sm text-gray-700 mb-2">
                      <p className="font-medium">{event.date}</p>
                    </div>

                    {/* Opening/Closing Times */}
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      {event.openingTime && <p>{event.openingTime}</p>}
                      {event.closingTime && <p>{event.closingTime}</p>}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          {event.rating.toFixed(1)}
                        </span>
                        <div className="flex">{renderStars(event.rating)}</div>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({event.reviewsCount} Reviews)
                      </span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="text-lg">
                        <span className="font-bold text-gray-900">
                          {event.price}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          {event.pricePerPerson}
                        </span>
                      </div>
                      <Link
                        href={`/event/${event.id}`}
                        className="bg-[#FF5A1F] hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Ticket size={16} />
                        Acheter
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Interactive Map */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full min-h-[600px] sticky top-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    Carte interactive
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-[#FF5A1F]" />
                    <span>Casablanca, Maroc</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Explorez les événements sur la carte et cliquez sur les
                  marqueurs pour plus de détails
                </p>
              </div>

              <InteractiveMap
                events={nearbyEvents}
                center={[33.5731, -7.5898]}
                zoom={12}
                className="border border-gray-200 rounded-xl"
              />

              {/* Map Legend */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-pulse"></div>
                  <span>Événements disponibles</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <span>🔍 Zoom pour explorer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>
    </main>
  );
}
