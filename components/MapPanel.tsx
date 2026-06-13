'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPanelProps {
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function MapPanel({ selectedLocation }: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [0, 0],
      zoom: 2,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;

    const position = [selectedLocation.latitude, selectedLocation.longitude] as [number, number];
    mapRef.current.flyTo(position, 12, { duration: 1.2 });

    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    } else {
      markerRef.current = L.marker(position, { icon: ICON }).addTo(mapRef.current);
    }
  }, [selectedLocation]);

  return (
    <div className="h-[640px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
