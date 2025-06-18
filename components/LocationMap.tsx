"use client";

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  center: [number, number];
  price: string;
  className?: string;
}

export default function LocationMap({ center, price, className = "" }: LocationMapProps) {
  useEffect(() => {
    // Create map instance
    const map = L.map('location-map').setView(center, 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Custom price marker icon
    const priceMarker = L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div class="relative">
          <div class="bg-[#FF5A1F] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-white">
            ${price}
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#FF5A1F]"></div>
        </div>
      `,
      iconSize: [80, 40],
      iconAnchor: [40, 40],
    });

    // Add marker with price
    L.marker(center, { icon: priceMarker }).addTo(map);

    // Add zoom control with custom styling
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Cleanup
    return () => {
      map.remove();
    };
  }, [center, price]);

  return (
    <div 
      id="location-map" 
      className={`w-full h-[400px] rounded-xl overflow-hidden shadow-lg ${className}`}
    />
  );
}