"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LocateFixed, Maximize2, Minimize2, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatCoordinates, isSupportedPoint, type FarmPoint } from "@/lib/farm";
import { useFarm } from "./farm-provider";
import { FarmMap } from "./farm-map";
import { LocationSearch } from "./location-search";

export function FarmLocation() {
  const { farm, setFarm } = useFarm();
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const locationRequest = useRef(0);

  useEffect(() => () => { locationRequest.current += 1; }, []);

  function selectLocation(point: FarmPoint, name: string) {
    if (!isSupportedPoint(point)) {
      setLocationError("This location is outside the Albay pilot area. Search in Albay or select a point on the map.");
      return;
    }
    locationRequest.current += 1;
    setLocating(false);
    setLocationError("");
    setFarm((current) => ({ ...current, point, locationName: name }));
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location is not available in this browser. Search for your farm or select a point on the map.");
      return;
    }
    const request = ++locationRequest.current;
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (request !== locationRequest.current) return;
        selectLocation({ lat: coords.latitude, lng: coords.longitude }, "Your location in Albay");
      },
      () => {
        if (request !== locationRequest.current) return;
        setLocating(false);
        setLocationError("We could not access your location. Allow location access or search for a place in Albay.");
      },
      { timeout: 15000, maximumAge: 0 },
    );
  }

  return <div className="space-y-3">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1"><LocationSearch onSelect={selectLocation} /></div>
      <Button type="button" variant="outline" onClick={useMyLocation} disabled={locating}>
        {locating ? <Spinner aria-hidden="true" /> : <LocateFixed aria-hidden="true" />}
        {locating ? "Finding your location..." : "Use my location"}
      </Button>
    </div>
    <div className="flex justify-end">
      <Button type="button" variant="ghost" size="sm" className="lg:hidden" aria-expanded={mapExpanded} aria-controls="farm-map-region" onClick={() => setMapExpanded((current) => !current)}>
        {mapExpanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
        {mapExpanded ? "Reduce map" : "Expand map"}
      </Button>
    </div>
    {locationError && <Alert variant="destructive"><TriangleAlert aria-hidden="true" /><AlertTitle>Location could not be selected</AlertTitle><AlertDescription>{locationError}</AlertDescription></Alert>}
    <div id="farm-map-region"><FarmMap point={farm.point} onChange={(point) => selectLocation(point, "Selected farm in Albay")} className={mapExpanded ? "h-120 lg:h-107.5" : undefined} /></div>
    <p className="text-sm text-muted-foreground">Click to place a pin. Drag it to refine your location.</p>
    <div role="status" aria-live="polite" className="flex flex-wrap items-center justify-between gap-2 text-sm">
      {farm.point && <><Badge variant="success"><Check aria-hidden="true" />Farm location selected</Badge><p className="font-mono tabular-nums">{formatCoordinates(farm.point)}</p><p className="w-full wrap-anywhere text-muted-foreground">{farm.locationName}</p></>}
    </div>
  </div>;
}
