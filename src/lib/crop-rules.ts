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
};

// Screening ranges compiled from the supplied crop reference links and common
// agronomic ranges. These are decision-support thresholds, not yield models.
export const CROP_RULES: Record<string, CropRule> = {
  Rice: {
    name: "Rice (Oryza sativa)", growingMonths: [6, 7, 8, 9],
    rainfallMm: { min: 600, idealMin: 900, idealMax: 1500, max: 2200 },
    temperatureC: { min: 18, idealMin: 22, idealMax: 32, max: 36 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.0 }, textures: ["clay", "clay loam", "loam"], waterDemand: "high", soilHealth: 1,
  },
  Corn: {
    name: "Corn (Zea mays)", growingMonths: [6, 7, 8, 9],
    rainfallMm: { min: 400, idealMin: 500, idealMax: 800, max: 1200 },
    temperatureC: { min: 18, idealMin: 21, idealMax: 30, max: 35 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.5 }, textures: ["loam", "clay loam", "sandy loam"], waterDemand: "medium", soilHealth: 1,
  },
  "Mung bean": {
    name: "Mung bean (Vigna radiata)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 250, idealMin: 300, idealMax: 500, max: 750 },
    temperatureC: { min: 20, idealMin: 25, idealMax: 32, max: 36 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.5 }, textures: ["sandy loam", "loam", "clay loam"], waterDemand: "low", soilHealth: 5,
  },
  "Sweet potato": {
    name: "Sweet potato (Ipomoea batatas)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 400, idealMin: 500, idealMax: 1000, max: 1500 },
    temperatureC: { min: 18, idealMin: 22, idealMax: 30, max: 35 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 6.8 }, textures: ["sandy loam", "loam"], waterDemand: "low", soilHealth: 2,
  },
  Eggplant: {
    name: "Eggplant (Solanum melongena)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 500, idealMin: 600, idealMax: 1200, max: 1800 },
    temperatureC: { min: 18, idealMin: 22, idealMax: 30, max: 35 }, heatStressC: 34,
    soilPh: { min: 5.5, max: 7.2 }, textures: ["loam", "sandy loam", "clay loam"], waterDemand: "medium", soilHealth: 1,
  },
  "Yardlong bean": {
    name: "Yardlong bean (Vigna unguiculata)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 400, idealMin: 600, idealMax: 1000, max: 1500 },
    temperatureC: { min: 20, idealMin: 25, idealMax: 32, max: 36 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.5 }, textures: ["sandy loam", "loam", "clay loam"], waterDemand: "low", soilHealth: 5,
  },
  Peanut: {
    name: "Peanut (Arachis hypogaea)", growingMonths: [2, 3, 4, 5],
    rainfallMm: { min: 400, idealMin: 500, idealMax: 1000, max: 1500 },
    temperatureC: { min: 20, idealMin: 25, idealMax: 30, max: 35 }, heatStressC: 35,
    soilPh: { min: 5.5, max: 7.0 }, textures: ["sandy loam", "loam"], waterDemand: "low", soilHealth: 4,
  },
};

export const CROP_NAMES = Object.keys(CROP_RULES);
