"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

export type FarmPoint = { lat: number; lng: number };
const ALBAY_BOUNDS = [[12.85, 123.25], [13.65, 124.15]] as [[number, number], [number, number]];

export default function FarmMap({ point, onChange }: { point: FarmPoint | null; onChange: (point: FarmPoint) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    let disposed = false;
    async function createMap() {
      const L = await import("leaflet");
      if (disposed || !containerRef.current || mapRef.current) return;
      const albayBounds = L.latLngBounds(ALBAY_BOUNDS);
      const map = L.map(containerRef.current, { maxBounds: albayBounds, maxBoundsViscosity: 1, minZoom: 10 }).setView([13.1775, 123.528], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      map.on("click", event => onChangeRef.current({ lat: event.latlng.lat, lng: event.latlng.lng }));
      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 0);
    }
    createMap();
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; markerRef.current = null; };
  }, []);

  useEffect(() => {
    async function updateMarker() {
      const L = await import("leaflet");
      if (!mapRef.current || !point) return;
      const position: [number, number] = [point.lat, point.lng];
      if (!L.latLngBounds(ALBAY_BOUNDS).contains(position)) return;
      mapRef.current.flyTo(position, Math.max(mapRef.current.getZoom(), 13), { duration: 0.6 });
      if (!markerRef.current) {
        const icon = L.divIcon({ className: "farm-marker", html: "<span></span>", iconSize: [46, 54], iconAnchor: [23, 50] });
        markerRef.current = L.marker(position, { icon, draggable: true }).addTo(mapRef.current);
        markerRef.current.on("dragend", () => { const next = markerRef.current?.getLatLng(); if (next) onChangeRef.current({ lat: next.lat, lng: next.lng }); });
      } else markerRef.current.setLatLng(position);
    }
    updateMarker();
  }, [point]);

  return <div ref={containerRef} className="farm-map" aria-label="Interactive map of Albay. Click to place your farm." />;
}
