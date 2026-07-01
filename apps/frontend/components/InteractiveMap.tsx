'use client';

import React, { useEffect, useRef } from 'react';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: 'donor' | 'ngo' | 'volunteer';
  details?: string;
}

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  routeCoords?: [number, number][];
}

export default function InteractiveMap({
  center = [40.7200, -74.0000],
  zoom = 13,
  markers = [],
  routeCoords = [],
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const routePolylineRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current) return;

    // Dynamically load leaflet on the client side
    import('leaflet').then((L) => {
      if (mapInstance.current) return; // Prevent double initialization

      // Create map centered on coordinate
      const map = L.map(mapContainer.current!).setView(center, zoom);
      mapInstance.current = map;

      // Add tile layer (CartoDB Dark tiles for dark theme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20,
      }).addTo(map);

      // Create and plot polyline
      if (routeCoords && routeCoords.length > 0) {
        routePolylineRef.current = L.polyline(routeCoords, {
          color: '#6366f1',
          weight: 4,
          opacity: 0.6,
          dashArray: '5, 10',
        }).addTo(map);
      }

      // Plot all markers
      markers.forEach((m) => {
        let htmlClass = '';
        let labelChar = 'M';
        
        if (m.type === 'donor') {
          htmlClass = 'bg-emerald-500 glow-emerald';
          labelChar = 'D';
        } else if (m.type === 'ngo') {
          htmlClass = 'bg-indigo-500 glow-indigo';
          labelChar = 'N';
        } else {
          htmlClass = 'bg-amber-500 animate-bounce';
          labelChar = 'V';
        }

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-xs font-extrabold ${
            m.type === 'volunteer' ? 'text-black' : 'text-white'
          } ${htmlClass}">${labelChar}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([m.lat, m.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${m.label}</b>${m.details ? `<br/>${m.details}` : ''}`);

        markersRef.current[m.id] = marker;
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  // Handle dynamic coordinate updates (e.g. moving volunteer)
  useEffect(() => {
    markers.forEach((m) => {
      const existingMarker = markersRef.current[m.id];
      if (existingMarker) {
        existingMarker.setLatLng([m.lat, m.lng]);
        if (m.type === 'volunteer' && mapInstance.current) {
          mapInstance.current.panTo([m.lat, m.lng]);
        }
      }
    });
  }, [markers]);

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-inner">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] flex gap-3.5 z-[1000]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Donor</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
          <span>NGO</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-bounce" />
          <span>Volunteer</span>
        </div>
      </div>
    </div>
  );
}
