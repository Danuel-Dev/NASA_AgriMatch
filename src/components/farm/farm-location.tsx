"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, LocateFixed, MapPin, Maximize2, Minimize2, TriangleAlert } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  formatCoordinates,
  isSupportedPoint,
  type FarmPoint,
} from "@/lib/farm";
import { useFarm } from "./farm-provider";
import { FarmMap } from "./farm-map";
import { LocationSearch } from "./location-search";

export function FarmLocation() {
  const { farm, setFarm } = useFarm();
  const [latitude, setLatitude] = useState(
    farm.point ? String(farm.point.lat) : "",
  );
  const [longitude, setLongitude] = useState(
    farm.point ? String(farm.point.lng) : "",
  );
  const [coordinateError, setCoordinateError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const locationRequest = useRef(0);

  useEffect(
    () => () => {
      locationRequest.current += 1;
    },
    [],
  );

  function selectLocation(point: FarmPoint, name: string) {
    if (!isSupportedPoint(point)) {
      setLocationError(
        "This location is outside the Albay pilot area. Search in Albay or enter a supported coordinate.",
      );
      return;
    }
    locationRequest.current += 1;
    setLocating(false);
    setLocationError("");
    setCoordinateError("");
    setLatitude(String(point.lat));
    setLongitude(String(point.lng));
    setFarm((current) => ({ ...current, point, locationName: name }));
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationError(
        "Location is not available in this browser. Search for your farm or enter coordinates.",
      );
      return;
    }
    const request = ++locationRequest.current;
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (request !== locationRequest.current) return;
        setLocating(false);
        selectLocation(
          { lat: coords.latitude, lng: coords.longitude },
          "Your location in Albay",
        );
      },
      () => {
        if (request !== locationRequest.current) return;
        setLocating(false);
        setLocationError(
          "We could not access your location. Allow location access, search for a place, or enter coordinates.",
        );
      },
      { timeout: 15000, maximumAge: 0 },
    );
  }

  function useCoordinates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const point = { lat: Number(latitude), lng: Number(longitude) };
    if (!latitude.trim() || !longitude.trim() || !isSupportedPoint(point)) {
      setCoordinateError(
        "Enter a latitude from 12.85 to 13.65 and a longitude from 123.25 to 124.15 for the Albay pilot area.",
      );
      return;
    }
    selectLocation(point, "Selected farm in Albay");
  }

  return (
    <div className="space-y-3">
      <LocationSearch onSelect={selectLocation} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={useMyLocation}
          disabled={locating}
        >
          {locating ? (
            <Spinner aria-hidden="true" />
          ) : (
            <LocateFixed aria-hidden="true" />
          )}
          {locating ? "Finding your location…" : "Use my location"}
        </Button>
        <Button type="button" variant="ghost" size="sm" className="lg:hidden" aria-expanded={mapExpanded} aria-controls="farm-map-region" onClick={() => setMapExpanded((current) => !current)}>
          {mapExpanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
          {mapExpanded ? "Reduce map" : "Expand map"}
        </Button>
      </div>
      {locationError && (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Location could not be selected</AlertTitle>
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}
      <div id="farm-map-region">
        <FarmMap
          point={farm.point}
          onChange={(point) => selectLocation(point, "Selected farm in Albay")}
          className={mapExpanded ? "h-120 lg:h-107.5" : undefined}
        />
      </div>
      <p className="text-sm text-muted-foreground">Click to place a pin. Drag it to refine your location.</p>
      <div
        role="status"
        aria-live="polite"
        className="flex flex-wrap items-center justify-between gap-2 text-sm"
      >
        {farm.point ? (
          <>
            <Badge variant="success">
              <Check aria-hidden="true" />
              Farm location selected
            </Badge>
            <p className="font-mono tabular-nums">
              {formatCoordinates(farm.point)}
            </p>
            <p className="w-full wrap-anywhere text-muted-foreground">{farm.locationName}</p>
          </>
        ) : (
          null
        )}
      </div>
      <Accordion className="border-t">
        <AccordionItem value="coordinates">
          <AccordionTrigger className="min-h-12">
            Enter farm coordinates instead
          </AccordionTrigger>
          <AccordionContent>
            <form
              onSubmit={useCoordinates}
              noValidate
              className="space-y-4 pt-3"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={!!coordinateError}>
                  <FieldLabel htmlFor="latitude">Latitude (° N)</FieldLabel>
                  <Input
                    id="latitude"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="12.85"
                    max="13.65"
                    required
                    value={latitude}
                    onChange={(event) => {
                      setLatitude(event.target.value);
                      setCoordinateError("");
                    }}
                    aria-invalid={!!coordinateError}
                    aria-describedby={
                      coordinateError ? "coordinates-error" : "coordinates-help"
                    }
                  />
                </Field>
                <Field data-invalid={!!coordinateError}>
                  <FieldLabel htmlFor="longitude">Longitude (° E)</FieldLabel>
                  <Input
                    id="longitude"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="123.25"
                    max="124.15"
                    required
                    value={longitude}
                    onChange={(event) => {
                      setLongitude(event.target.value);
                      setCoordinateError("");
                    }}
                    aria-invalid={!!coordinateError}
                    aria-describedby={
                      coordinateError ? "coordinates-error" : "coordinates-help"
                    }
                  />
                </Field>
              </div>
              <FieldDescription id="coordinates-help">
                Albay pilot bounds: latitude 12.85–13.65, longitude
                123.25–124.15.
              </FieldDescription>
              {coordinateError && (
                <FieldError id="coordinates-error">
                  {coordinateError}
                </FieldError>
              )}
              <Button type="submit" variant="outline">
                <MapPin aria-hidden="true" />
                Use coordinates
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
