"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapPinOff } from "lucide-react";
import { ALBAY_BOUNDS, isSupportedPoint } from "@/lib/farm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { FarmMapProps } from "./farm-map";
import "leaflet/dist/leaflet.css";
import "./farm-map.css";

export default function FarmMapCanvas({ point, onChange }: FarmMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const pointRef = useRef(point);
  const [tilesFailed, setTilesFailed] = useState(false);
  const readOnly = !onChange;

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;
    const bounds = L.latLngBounds(ALBAY_BOUNDS);
    const map = L.map(containerRef.current, {
      maxBounds: bounds,
      maxBoundsViscosity: 1,
      minZoom: 10,
      scrollWheelZoom: false,
    }).setView([13.1775, 123.528], 10);
    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(map);
    tiles.on("tileerror", () => setTilesFailed(true));
    map.on("click", (event) => {
      const next = { lat: event.latlng.lat, lng: event.latlng.lng };
      if (isSupportedPoint(next)) onChangeRef.current?.(next);
    });
    mapRef.current = map;
    const resize = new ResizeObserver(() => map.invalidateSize());
    resize.observe(containerRef.current);
    return () => {
      resize.disconnect();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    pointRef.current = point;
    const map = mapRef.current;
    if (!map) return;
    if (!point) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (!isSupportedPoint(point)) return;
    const position = L.latLng(point.lat, point.lng);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.setView(position, Math.max(map.getZoom(), 13), { animate: false });
    } else {
      map.flyTo(position, Math.max(map.getZoom(), 13), { duration: 0.2 });
    }
    if (!markerRef.current) {
      const marker = L.marker(position, {
        draggable: !readOnly,
        title: readOnly
          ? "Selected farm"
          : "Selected farm. Drag to refine its position.",
        icon: L.divIcon({
          className: "farm-marker",
          html: '<span aria-hidden="true"></span>',
          iconSize: [44, 52],
          iconAnchor: [22, 48],
        }),
      }).addTo(map);
      marker.on("dragend", () => {
        const location = marker.getLatLng();
        const next = { lat: location.lat, lng: location.lng };
        if (isSupportedPoint(next)) onChangeRef.current?.(next);
        else if (pointRef.current)
          marker.setLatLng([pointRef.current.lat, pointRef.current.lng]);
      });
      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng(position);
    }
  }, [point, readOnly]);

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        className="farm-map isolate"
        aria-label={
          readOnly
            ? "Map of the selected farm in Albay"
            : "Interactive Albay map. Use search or coordinate entry for keyboard location selection."
        }
      />
      {tilesFailed && (
        <div className="absolute right-3 bottom-10 left-3 z-10">
          <Alert variant="warning" role="status">
            <MapPinOff aria-hidden="true" />
            <AlertTitle>Map tiles are unavailable</AlertTitle>
            <AlertDescription>
              Your farm selection is preserved. Search and coordinate entry are
              still available.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
