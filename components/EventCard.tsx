"use client";

import React from "react";
import Image from "next/image";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

// Types de props
type EventCardProps = {
  event: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    location: string;
    eventDate: string; // ISO string
    userId: string;
  };
  currentUserId: string;
  availability: {
    totalTickets: number;
    purchasedCount: number;
    activeOffers: number;
  };
  userTicket?: {
    id: string;
  };
  queuePosition?: {
    position: number;
    status: "waiting" | "offered" | "expired";
  };
};

export function EventCard({
  event,
  currentUserId,
  availability,
  userTicket,
  queuePosition,
}: EventCardProps) {
  const router = useRouter();

  const isPastEvent = new Date(event.eventDate).getTime() < Date.now();
  const isEventOwner = currentUserId === event.userId;

  // Debug availability dans la console
  console.log("availability:", availability);

  const handleClick = () => {
    router.push(`/event/${event.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden relative ${
        isPastEvent ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {event.imageUrl && (
        <div className="relative w-full h-48">
          <Image src={event.imageUrl} alt={event.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="p-6 relative">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>

          <span
            className={`px-4 py-1.5 font-semibold rounded-full ${
              isPastEvent ? "bg-gray-50 text-gray-500" : "bg-green-50 text-green-700"
            }`}
          >
            £{event.price.toFixed(2)}
          </span>
        </div>

        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Ticket className="w-4 h-4 mr-2 text-red-600" />
            <span style={{ color: "red", fontWeight: "bold" }}>
              {availability.purchasedCount} / {availability.totalTickets} places prises
              {!isPastEvent && availability.activeOffers > 0 && (
                <span className="text-amber-600 text-xs ml-2">
                  ({availability.activeOffers} en cours d'achat)
                </span>
              )}
            </span>
          </div>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">{event.description}</p>
      </div>
    </div>
  );
}

// Composant parent d'exemple qui utilise EventCard
export default function EventCardExample() {
  const exampleEvent = {
    id: "event1",
    name: "Concert de Test",
    description: "Un super concert à ne pas manquer !",
    price: 29.99,
    imageUrl: "/images/concert.jpg",
    location: "Casablanca Arena",
    eventDate: new Date(Date.now() + 86400000).toISOString(), // demain
    userId: "user123",
  };

  const exampleAvailability = {
    totalTickets: 100,
    purchasedCount: 42,
    activeOffers: 3,
  };

  const currentUserId = "user456";

  return (
    <div className="max-w-md mx-auto mt-10">
      <EventCard
        event={exampleEvent}
        currentUserId={currentUserId}
        availability={exampleAvailability}
      />
    </div>
  );
}
