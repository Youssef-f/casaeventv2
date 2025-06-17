"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  CalendarDays,
  Edit,
  Ticket,
  Ban,
  Banknote,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Simuler des données (ex. dummyEvents)
const dummyEvents = [
  {
    id: "1",
    name: "Rema Live in Casa",
    description: "First stop of the HEIS World Tour",
    eventDate: new Date().getTime() + 7 * 24 * 60 * 60 * 1000, // dans 7 jours
    imageUrl: "/images/rema.jpg",
    is_cancelled: false,
    totalTickets: 500,
    price: 25,
    metrics: {
      soldTickets: 350,
      refundedTickets: 0,
      revenue: 8750,
    },
  },
  {
    id: "2",
    name: "Afrobeats Party",
    description: "Past event",
    eventDate: new Date().getTime() - 10 * 24 * 60 * 60 * 1000, // passé
    imageUrl: "/images/afro.jpg",
    is_cancelled: true,
    totalTickets: 300,
    price: 20,
    metrics: {
      soldTickets: 0,
      refundedTickets: 280,
      revenue: 0,
    },
  },
];

export default function SellerEventList() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  const upcomingEvents = dummyEvents.filter((e) => e.eventDate > Date.now());
  const pastEvents = dummyEvents.filter((e) => e.eventDate <= Date.now());

  if (!userId) return <p className="text-gray-500">Loading user...</p>;

  return (
    <div className="mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500">No upcoming events</p>
          ) : (
            upcomingEvents.map((event) => (
              <SellerEventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </div>

      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Past Events
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {pastEvents.map((event) => (
              <SellerEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SellerEventCard({ event }: { event: any }) {
  const isPast = event.eventDate < Date.now();

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border ${
        event.is_cancelled ? "border-red-300" : "border-orange-300"
      } overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex items-start gap-6">
          {event.imageUrl && (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden shrink-0">
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-orange-700">
                  {event.name}
                </h3>
                <p className="mt-1 text-gray-600">{event.description}</p>
                {event.is_cancelled && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <Ban className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Event Cancelled & Refunded
                    </span>
                  </div>
                )}
              </div>

              {!isPast && !event.is_cancelled && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/seller/events/${event.id}/edit`}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <EventMetric
                icon={<Ticket className="w-4 h-4" />}
                label={
                  event.is_cancelled ? "Tickets Refunded" : "Tickets Sold"
                }
                value={
                  event.is_cancelled ? (
                    <>
                      {event.metrics.refundedTickets}
                      <span className="text-sm text-gray-500 font-normal">
                        {" "}
                        refunded
                      </span>
                    </>
                  ) : (
                    <>
                      {event.metrics.soldTickets}
                      <span className="text-sm text-gray-500 font-normal">
                        /{event.totalTickets}
                      </span>
                    </>
                  )
                }
              />

              <EventMetric
                icon={<Banknote className="w-4 h-4" />}
                label={event.is_cancelled ? "Amount Refunded" : "Revenue"}
                value={`£${
                  event.is_cancelled
                    ? event.metrics.refundedTickets * event.price
                    : event.metrics.revenue
                }`}
              />

              <EventMetric
                icon={<CalendarDays className="w-4 h-4" />}
                label="Date"
                value={new Date(event.eventDate).toLocaleDateString()}
              />

              <EventMetric
                icon={<InfoIcon className="w-4 h-4" />}
                label="Status"
                value={
                  event.is_cancelled
                    ? "Cancelled"
                    : isPast
                    ? "Ended"
                    : "Active"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-orange-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 text-orange-600 mb-1">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-lg font-semibold text-orange-900">{value}</p>
    </div>
  );
}
