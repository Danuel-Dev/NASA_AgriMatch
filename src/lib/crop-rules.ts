import fs from "node:fs/promises";
import path from "node:path";

export type CropRule = {
  name: string;
  growingMonths: number[];
  rainfallMm: { min: number; idealMin: number; idealMax: number; max: number };
  temperatureC: { min: number; idealMin: number; idealMax: number; max: number };
  heatStressC: number;
  soilPh: { min: number; max: number };
  textures: string[];
  waterDemand: "low" | "medium" | "high";
  soilHealth: number;
  nitrogenFixing: boolean;
  documentedPreviousCrops: string[];
  rotationStatus: string;
  rotationEvidenceScope: string;
};

// Screening ranges compiled from the supplied crop reference links and common
// agronomic ranges. These are decision-support thresholds, not yield models.
const BASE_CROP_RULES: Record<string, CropRule> = {
  Rice: {
    name: "Rice (Oryza sativa)", growingMonths: [6, 7, 8, 9],
    rainfallMm: { min: 600, idealMin: 900, idealMax: 1500, max: 2200 },
    temperatureC: { min: 18, idealMin: 22, idealMax: 32, max: 36 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.0 }, textures: ["clay", "clay loam", "loam"], waterDemand: "high", soilHealth: 1, nitrogenFixing: false, documentedPreviousCrops: [], rotationStatus: "", rotationEvidenceScope: "",
  },
  Corn: {
    name: "Corn (Zea mays)", growingMonths: [6, 7, 8, 9],
    rainfallMm: { min: 400, idealMin: 500, idealMax: 800, max: 1200 },
    temperatureC: { min: 18, idealMin: 21, idealMax: 30, max: 35 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.5 }, textures: ["loam", "clay loam", "sandy loam"], waterDemand: "medium", soilHealth: 1, nitrogenFixing: false, documentedPreviousCrops: [], rotationStatus: "", rotationEvidenceScope: "",
  },
  "Mung bean": {
    name: "Mung bean (Vigna radiata)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 250, idealMin: 300, idealMax: 500, max: 750 },
    temperatureC: { min: 20, idealMin: 25, idealMax: 32, max: 36 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.5 }, textures: ["sandy loam", "loam", "clay loam"], waterDemand: "low", soilHealth: 5, nitrogenFixing: false, documentedPreviousCrops: [], rotationStatus: "", rotationEvidenceScope: "",
  },
  "Sweet potato": {
    name: "Sweet potato (Ipomoea batatas)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 400, idealMin: 500, idealMax: 1000, max: 1500 },
    temperatureC: { min: 18, idealMin: 22, idealMax: 30, max: 35 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 6.8 }, textures: ["sandy loam", "loam"], waterDemand: "low", soilHealth: 2, nitrogenFixing: false, documentedPreviousCrops: [], rotationStatus: "", rotationEvidenceScope: "",
  },
  Eggplant: {
    name: "Eggplant (Solanum melongena)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 500, idealMin: 600, idealMax: 1200, max: 1800 },
    temperatureC: { min: 18, idealMin: 22, idealMax: 30, max: 35 }, heatStressC: 34,
    soilPh: { min: 5.5, max: 7.2 }, textures: ["loam", "sandy loam", "clay loam"], waterDemand: "medium", soilHealth: 1, nitrogenFixing: false, documentedPreviousCrops: [], rotationStatus: "", rotationEvidenceScope: "",
  },
  "Yardlong bean": {
    name: "Yardlong bean (Vigna unguiculata)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 400, idealMin: 600, idealMax: 1000, max: 1500 },
    temperatureC: { min: 20, idealMin: 25, idealMax: 32, max: 36 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.5 }, textures: ["sandy loam", "loam", "clay loam"], waterDemand: "low", soilHealth: 5, nitrogenFixing: false, documentedPreviousCrops: [], rotationStatus: "", rotationEvidenceScope: "",
  },
  Peanut: {
    name: "Peanut (Arachis hypogaea)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 400, idealMin: 500, idealMax: 1000, max: 1500 },
    temperatureC: { min: 20, idealMin: 25, idealMax: 30, max: 35 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.0 }, textures: ["sandy loam", "loam"], waterDemand: "low", soilHealth: 4, nitrogenFixing: false, documentedPreviousCrops: [], rotationStatus: "", rotationEvidenceScope: "",
  },
};

export async function loadCropRules() {
  const file = path.join(process.cwd(), "data", "crop", "Crop_requirements_and_rotation_updated.csv");
  try {
    const lines = (await fs.readFile(file, "utf8")).split(/\r?\n/).filter(Boolean);
    const headers = lines.shift()!.split(",");
    const rules = { ...BASE_CROP_RULES };
    for (const line of lines) {
      const values = line.split(",");
      // The source keeps narrative fields with unquoted commas. The numeric fields and
      // documented predecessor column are stable, so read those by their fixed positions.
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
      const base = rules[row.Crop];
      if (!base) continue;
      rules[row.Crop] = {
        ...base,
        // The engine compares rainfall for the selected growing period, so use the
        // dataset's growing-period water requirement rather than annual totals.
        rainfallMm: { min: Number(values[13]), idealMin: Number(values[13]), idealMax: Number(values[14]), max: Number(values[14]) },
        temperatureC: { min: Number(row.Optimal_Temperature_Min_C), idealMin: Number(row.Optimal_Temperature_Min_C), idealMax: Number(row.Optimal_Temperature_Max_C), max: Number(row.Optimal_Temperature_Max_C) },
        soilPh: { min: Number(row.Optimal_Soil_pH_Min), max: Number(row.Optimal_Soil_pH_Max) },
        documentedPreviousCrops: values[15] ? values[15].split(";").map((crop) => crop.trim()) : [],
        nitrogenFixing: row.Nitrogen_Fixing.toLowerCase().startsWith("yes"),
        rotationStatus: row.Rotation_Status,
        rotationEvidenceScope: row.Rotation_Evidence_Scope,
      };
    }
    return rules;
  } catch {
    return BASE_CROP_RULES;
  }
}

export const CROP_RULES = BASE_CROP_RULES;
export const CROP_NAMES = Object.keys(BASE_CROP_RULES);
