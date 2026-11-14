import { isSupportedPoint, type FarmPoint } from "@/lib/farm";

export type LocationResult = {
  id: number;
  label: string;
  description: string;
  point: FarmPoint;
};

function parseResults(data: unknown): LocationResult[] {
  if (!Array.isArray(data))
    throw new Error(
      "The location service returned an invalid response. Please try again.",
    );

  const results = new Map<number, LocationResult>();
  for (const item of data) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("place_id" in item) ||
      typeof item.place_id !== "number" ||
      !Number.isFinite(item.place_id) ||
      !("display_name" in item) ||
      typeof item.display_name !== "string" ||
      !item.display_name.trim() ||
      !("lat" in item) ||
      typeof item.lat !== "string" ||
      !item.lat.trim() ||
      !("lon" in item) ||
      typeof item.lon !== "string" ||
      !item.lon.trim()
    ) {
      throw new Error(
        "The location service returned an invalid result. Please try again.",
      );
    }
    const point = { lat: Number(item.lat), lng: Number(item.lon) };
    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) {
      throw new Error(
        "The location service returned invalid coordinates. Please try again.",
      );
    }
    if (isSupportedPoint(point)) {
      results.set(item.place_id, {
        id: item.place_id,
        label: item.display_name.split(",").slice(0, 2).join(","),
        description: item.display_name,
        point,
      });
    }
  }
  return [...results.values()];
}

export async function searchLocations(
  query: string,
  signal: AbortSignal,
): Promise<LocationResult[]> {
  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    countrycodes: "ph",
    bounded: "1",
    viewbox: "123.25,13.65,124.15,12.85",
    q: `${query.trim()}, Albay, Bicol Region, Philippines`,
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(
      `The location service returned HTTP ${response.status}. Try again or enter your farm coordinates.`,
    );
  }
  const data: unknown = await response.json();
  return parseResults(data);
}
