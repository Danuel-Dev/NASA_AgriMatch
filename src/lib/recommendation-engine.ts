import { CROP_RULES, type CropRule } from "./crop-rules";
import type { FarmDraft, FarmPoint } from "./farm";

export type SoilSample = { ph: number | null; sand: number | null; silt: number | null; clay: number | null; texture: string | null; source: string };
export type ClimateSample = { months: number[]; mean: number; max: number; min: number; rainfallTotal: number; source: string };
export type ClimateData = { rainfall: ClimateSample; temperature: ClimateSample; heat: ClimateSample; cold: ClimateSample };
export type CropAssessment = {
  crop: string; score: number; rainfallScore: number; temperatureScore: number; soilScore: number; waterScore: number;
  rainfallTotal: number; rainfallRange: string; meanTemperature: number; maxTemperature: number;
  warning: string; notes: string[]; rule: CropRule;
};
export type RecommendationResult = { location: FarmPoint; soil: SoilSample; climate: ClimateData; crops: CropAssessment[]; rotations: RotationResult[]; disclaimer: string };
export type RotationResult = { id: string; name: string; crops: string[]; score: number; summary: string; explanation: string; strengths: string[]; tradeoff: string; tone: "blue" | "green" | "pink"; priorityMetrics: { label: string; value: number; tone: "blue" | "green" | "pink" | "amber" }[] };

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const average = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
const fitRange = (value: number, min: number, idealMin: number, idealMax: number, max: number) => {
  if (value >= idealMin && value <= idealMax) return 100;
  if (value < min || value > max) return 20;
  return Math.round(70 + 30 * (value < idealMin ? (value - min) / (idealMin - min) : (max - value) / (max - idealMax)));
};

function normaliseTexture(texture: string | null) {
  return (texture ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function scoreSoil(sample: SoilSample, rule: CropRule) {
  const phScore = sample.ph == null ? 60 : sample.ph >= rule.soilPh.min && sample.ph <= rule.soilPh.max ? 100 : 35;
  const texture = normaliseTexture(sample.texture);
  const textureMatches = rule.textures.includes(texture) || (texture === "sand" && rule.textures.includes("sandy loam")) || (texture === "silt" && rule.textures.includes("loam"));
  const textureScore = !texture ? 60 : textureMatches ? 100 : 45;
  return Math.round(phScore * 0.6 + textureScore * 0.4);
}

function scoreWater(irrigation: string, demand: CropRule["waterDemand"]) {
  if (irrigation === "Adequate") return demand === "high" ? 100 : 95;
  if (demand === "low") return 100;
  if (demand === "medium") return 70;
  return 40;
}

function seasonMonths(season: string) {
  if (season === "Dry season") return [12, 1, 2, 3];
  if (season === "Wet season") return [6, 7, 8, 9];
  return [4, 5, 10, 11];
}

function rotateMonths(rule: CropRule, season: string) {
  if (rule.growingMonths.length === 12) return rule.growingMonths;
  const preferred = seasonMonths(season);
  return preferred.length ? preferred : rule.growingMonths;
}

export function assessCrop(crop: string, farm: FarmDraft, climate: ClimateData, soil: SoilSample): CropAssessment {
  const rule = CROP_RULES[crop] ?? CROP_RULES.Rice;
  const months = rotateMonths(rule, farm.season);
  const rainfallTotal = months.reduce((sum, month) => sum + (climate.rainfall.months[month - 1] ?? 0), 0);
  const meanTemperature = average(months.map((month) => climate.temperature.months[month - 1] ?? climate.temperature.mean));
  const maxTemperature = Math.max(...months.map((month) => climate.heat.months[month - 1] ?? climate.heat.max));
  const rainfallScore = fitRange(rainfallTotal, rule.rainfallMm.min, rule.rainfallMm.idealMin, rule.rainfallMm.idealMax, rule.rainfallMm.max);
  const temperatureScore = fitRange(meanTemperature, rule.temperatureC.min, rule.temperatureC.idealMin, rule.temperatureC.idealMax, rule.temperatureC.max);
  const heatPenalty = maxTemperature > rule.heatStressC ? Math.min(35, Math.round((maxTemperature - rule.heatStressC) * 12)) : 0;
  const soilScore = scoreSoil(soil, rule);
  const waterScore = scoreWater(farm.irrigation, rule.waterDemand);
  const baseScore = rainfallScore * 0.35 + temperatureScore * 0.25 + soilScore * 0.25 + waterScore * 0.15 - heatPenalty;
  const priorityScores: number[] = [];
  if (farm.priorities.includes("Conserve water")) priorityScores.push(waterScore);
  if (farm.priorities.includes("Improve soil health")) priorityScores.push(soilScore);
  if (farm.priorities.includes("Climate suitability")) priorityScores.push((rainfallScore + temperatureScore) / 2);
  if (farm.priorities.includes("Reduce heat stress")) priorityScores.push(clamp(100 - heatPenalty * 2));
  if (farm.priorities.includes("Reduce input needs")) priorityScores.push(waterScore * 0.6 + soilScore * 0.4);
  const priorityAdjustment = priorityScores.length ? average(priorityScores) * 0.12 : 0;
  const score = clamp(Math.round(baseScore * 0.88 + priorityAdjustment));
  const notes: string[] = [];
  if (rainfallTotal < rule.rainfallMm.min) notes.push(`Seasonal rainfall is below the ${rule.rainfallMm.min} mm minimum screening range.`);
  else if (rainfallTotal > rule.rainfallMm.max) notes.push(`Seasonal rainfall is above the ${rule.rainfallMm.max} mm upper screening range.`);
  else notes.push(`Estimated seasonal rainfall is ${Math.round(rainfallTotal)} mm for ${months.length} months.`);
  if (maxTemperature > rule.heatStressC) notes.push(`Maximum temperature reaches ${maxTemperature.toFixed(1)}°C; heat-stress risk is possible.`);
  if (soil.ph != null && (soil.ph < rule.soilPh.min || soil.ph > rule.soilPh.max)) notes.push(`Estimated soil pH ${soil.ph.toFixed(1)} is outside the preferred ${rule.soilPh.min}–${rule.soilPh.max} range.`);
  if (soil.texture && !rule.textures.includes(normaliseTexture(soil.texture))) notes.push(`Estimated ${soil.texture} texture is not the preferred texture for this crop.`);
  const warning = rainfallTotal < rule.rainfallMm.min ? "Rainfall may be insufficient during the growing period." : rainfallTotal > rule.rainfallMm.max ? "Rainfall may exceed the preferred growing-period range." : maxTemperature > rule.heatStressC ? "Seasonal rainfall is adequate, but heat-stress risk should be monitored." : "No major seasonal rainfall warning detected.";
  return { crop, score, rainfallScore, temperatureScore, soilScore, waterScore, rainfallTotal, rainfallRange: `${rule.rainfallMm.min}–${rule.rainfallMm.max} mm`, meanTemperature, maxTemperature, warning, notes, rule };
}

export function buildRotations(assessments: CropAssessment[], farm: FarmDraft): RotationResult[] {
  const sorted = [...assessments].sort((a, b) => b.score - a.score);
  const byWater = [...assessments].sort((a, b) => (a.rule.waterDemand === "low" ? 0 : a.rule.waterDemand === "medium" ? 1 : 2) - (b.rule.waterDemand === "low" ? 0 : b.rule.waterDemand === "medium" ? 1 : 2));
  const bySoil = [...assessments].sort((a, b) => b.rule.soilHealth - a.rule.soilHealth);
  const diverse = ["low", "medium", "high"].map((demand) => sorted.find((item) => item.rule.waterDemand === demand)).filter((item): item is CropAssessment => !!item);
  const current = farm.currentRotation.map((crop) => assessments.find((item) => item.crop === crop)).filter((item): item is CropAssessment => !!item);
  const cropReason = (item: CropAssessment) => {
    const reasons: string[] = [];
    if (item.rainfallScore >= 80) reasons.push("seasonal rainfall fits its growing range");
    if (item.temperatureScore >= 80) reasons.push("temperature is within its preferred range");
    if (item.soilScore >= 80) reasons.push("the sampled soil is a good match");
    if (item.waterScore >= 85) reasons.push(`its ${item.rule.waterDemand} water demand matches the farm access`);
    if (item.rule.soilHealth >= 4) reasons.push("it can contribute to soil-health planning");
    return reasons.length ? reasons.join(", ") : "it remains a possible option, although one or more conditions need attention";
  };
  const priorityWeight = farm.priorities.includes("Climate suitability") ? 5 : 0;
  const waterFirst = farm.priorities.includes("Conserve water") || farm.priorities.includes("Reduce input needs");
  const soilFirst = farm.priorities.includes("Improve soil health");
  const diversityFirst = farm.priorities.includes("Support crop diversity");
  const rotation = (id: string, name: string, list: CropAssessment[], summary: string, explanation: string, tradeoff: string, tone: RotationResult["tone"]): RotationResult => {
    const sequence = list.slice(0, 3);
    const uniqueCrops = new Set(sequence.map((item) => item.crop)).size;
    const legumeCount = sequence.filter((item) => item.rule.soilHealth >= 4).length;
    const transitionScore = clamp(55 + (uniqueCrops - 1) * 12 + legumeCount * 10);
    const sequenceScore = clamp(Math.round(average(sequence.map((item) => item.score)) * 0.78 + transitionScore * 0.22 + priorityWeight));
    return { id, name, crops: sequence.map((item) => item.crop), score: sequenceScore, summary, explanation, strengths: sequence.map((item) => `${item.crop} (${item.score}/100): ${cropReason(item)}.`), tradeoff, tone,
    priorityMetrics: [
      { label: "Water fit", value: Math.round(average(list.slice(0, 3).map((item) => item.waterScore))), tone: "blue" },
      { label: "Soil health", value: Math.round((average(sequence.map((item) => item.soilScore * 0.7 + item.rule.soilHealth / 5 * 100 * 0.3)) + transitionScore) / 2), tone: "green" },
      { label: "Climate fit", value: Math.round(average(list.slice(0, 3).map((item) => (item.rainfallScore + item.temperatureScore) / 2))), tone: "pink" },
      { label: "Heat resilience", value: Math.round(average(list.slice(0, 3).map((item) => clamp(100 - Math.max(0, item.maxTemperature - item.rule.heatStressC) * 12)))), tone: "amber" },
    ],
    };
  };
  return [
    rotation("option-1", "Rotation option 1", current.length ? current : sorted, "Evaluates the selected crops against the sampled conditions.", "This is the current crop mix used as a baseline for comparison.", "Keeping the current mix may leave some climate or water risks unchanged.", "blue"),
    rotation("option-2", "Rotation option 2", waterFirst ? byWater : sorted, "An alternative sequence using the sampled climate, soil, and water conditions.", "This alternative places more emphasis on crops with lower water demand when appropriate.", "A different crop mix may involve different management and market timing.", "green"),
    rotation("option-3", "Rotation option 3", soilFirst ? bySoil : diversityFirst ? diverse : sorted, "An alternative sequence evaluated against the same farm conditions.", "This alternative considers soil-health contribution and crop diversity among the screening factors.", "Soil-health benefits are longer-term and are not measured as a guaranteed yield increase.", "pink"),
  ];
}

export function recommend(farm: FarmDraft, climate: ClimateData, soil: SoilSample): RecommendationResult {
  const crops = Object.keys(CROP_RULES).map((crop) => assessCrop(crop, farm, climate, soil));
  return { location: farm.point as FarmPoint, soil, climate, crops, rotations: buildRotations(crops, farm), disclaimer: "These are screening estimates based on modeled baseline climate and soil data. They are not guaranteed yields and do not replace field soil testing or local agronomic advice." };
}
