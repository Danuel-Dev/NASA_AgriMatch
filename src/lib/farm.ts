export type FarmPoint = { lat: number; lng: number };

export const ALBAY_BOUNDS: [[number, number], [number, number]] = [
  [12.85, 123.25],
  [13.65, 124.15],
];

export const CROP_OPTIONS = [
  "Rice", "Corn", "Mung bean", "Sweet potato",
  "Eggplant", "Yardlong bean", "Peanut",
];
export const IRRIGATION_OPTIONS = ["Adequate", "Limited"];
export const SOIL_OPTIONS = ["Clay loam", "Sandy loam", "Clay", "Loam"];
export const SEASON_OPTIONS = ["Dry season", "Wet season", "Transition season"];
export const PRIORITY_OPTIONS = [
  "Conserve water",
  "Improve soil health",
  "Climate suitability",
  "Reduce heat stress",
  "Support crop diversity",
  "Reduce input needs",
];

export const CROP_LABELS_FIL: Record<string, string> = {
  Rice: "Palay",
  Corn: "Mais",
  "Mung bean": "Monggo",
  "Sweet potato": "Kamote",
  Eggplant: "Talong",
  "Yardlong bean": "Sitaw",
  Peanut: "Mani",
};

export const IRRIGATION_LABELS_FIL: Record<string, string> = { Adequate: "Sapat", Limited: "Limitado" };
export const SOIL_LABELS_FIL: Record<string, string> = { "Clay loam": "Lupang luwad na loam", "Sandy loam": "Loam na mabuhangin", Clay: "Luwad", Loam: "Loam" };
export const SEASON_LABELS_FIL: Record<string, string> = { "Wet season": "Tag-ulan", "Dry season": "Tag-init", "Transition season": "Panahon ng paglipat" };
export const PRIORITY_LABELS_FIL: Record<string, string> = {
  "Conserve water": "Magtipid ng tubig",
  "Improve soil health": "Pagandahin ang kalusugan ng lupa",
  "Climate suitability": "Angkop sa klima",
  "Reduce heat stress": "Bawasan ang stress sa init",
  "Support crop diversity": "Suportahan ang diversity ng pananim",
  "Reduce input needs": "Bawasan ang pangangailangan sa input",
};

export type FarmDraft = {
  point: FarmPoint | null;
  locationName: string;
  currentRotation: string[];
  irrigation: string;
  soil: string;
  season: string;
  priorities: string[];
};

export const INITIAL_FARM: FarmDraft = {
  point: null,
  locationName: "Albay, Philippines",
  currentRotation: ["Rice", "Rice", "Rice"],
  irrigation: "Adequate",
  soil: "Clay loam",
  season: "Dry season",
  priorities: ["Conserve water"],
};

export function isSupportedPoint(point: FarmPoint): boolean {
  return (
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng) &&
    point.lat >= ALBAY_BOUNDS[0][0] &&
    point.lat <= ALBAY_BOUNDS[1][0] &&
    point.lng >= ALBAY_BOUNDS[0][1] &&
    point.lng <= ALBAY_BOUNDS[1][1]
  );
}

export function formatCoordinates(point: FarmPoint): string {
  return `${point.lat.toFixed(5)}° N, ${point.lng.toFixed(5)}° E`;
}

export function toggleSelection(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
