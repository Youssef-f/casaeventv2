"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Ticket } from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Event {
  id: number;
  title: string;
  location: string;
  address: string;
  date: string;
  price: string;
  rating: number;
  reviewsCount: number;
  image: string;
  position: [number, number];
  category: string;
}

interface InteractiveMapProps {
  events?: Event[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function InteractiveMap({ 
  events = [], 
  center = [33.5731, -7.5898], // Casablanca coordinates
  zoom = 12,
  className = ""
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Custom icon for events
    const eventIcon = L.divIcon({
      html: `
        <div class="relative">
          <div class="w-8 h-8 bg-[#FF5A1F] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#FF5A1F]"></div>
        </div>
      `,
      className: 'custom-event-marker',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40]
    });

    // Add markers for events
    events.forEach((event) => {
      const marker = L.marker(event.position, { icon: eventIcon }).addTo(map);
      
      // Create popup content
      const popupContent = `
        <div class="p-4 min-w-[280px] max-w-[320px]">
          <div class="flex gap-3 mb-3">
            <img src="${event.image}" alt="${event.title}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-sm text-gray-900 mb-1 line-clamp-2">${event.title}</h3>
              <div class="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${event.location}</span>
              </div>
              <p class="text-xs text-gray-500 mb-2">${event.address}</p>
            </div>
          </div>
          
          <div class="space-y-2 mb-3">
            <p class="text-sm font-medium text-gray-900">${event.date}</p>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <span class="text-sm font-bold text-gray-900">${event.rating.toFixed(1)}</span>
                <div class="flex">
                  ${Array.from({ length: 5 }, (_, i) => `
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="${i < Math.floor(event.rating) ? '#FCD34D' : 'none'}" stroke="#FCD34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                  `).join('')}
                </div>
              </div>
              <span class="text-xs text-gray-500">(${event.reviewsCount} avis)</span>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <span class="font-bold text-lg text-gray-900">${event.price}</span>
              <span class="text-gray-500 text-sm ml-1">/pers</span>
            </div>
            <button class="bg-[#FF5A1F] hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6l2 13h7l4-8H8"></path>
                <circle cx="9" cy="19" r="1"></circle>
                <circle cx="20" cy="19" r="1"></circle>
              </svg>
              Acheter
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'custom-popup'
      });
    });

    // Add some default markers if no events provided
    if (events.length === 0) {
      const defaultLocations = [
        { position: [33.5731, -7.5898], name: "Centre-ville" },
        { position: [33.5584, -7.6707], name: "Morocco Mall" },
        { position: [33.5892, -7.6036], name: "Ain Diab" }
      ];

      defaultLocations.forEach((location) => {
        L.marker(location.position, { icon: eventIcon })
          .addTo(map)
          .bindPopup(`<div class="p-2"><strong>${location.name}</strong><br/>Événements disponibles</div>`);
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [events, center, zoom]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-96 rounded-xl ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
}