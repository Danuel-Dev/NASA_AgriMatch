import fs from "node:fs/promises";
import path from "node:path";
import { fromFile } from "geotiff";
import type { ClimateData, ClimateSample, SoilSample } from "./recommendation-engine";

const root = path.join(process.cwd(), "data");
const climateFiles = {
  rainfall: "Precip Sum Ave_Regional_Monthly_2015_2025.csv",
  temperature: "2mTemp_Monthly_2015_2025.csv",
  heat: "2mMaxTemp_Regional_Monthly_2015_2025.csv",
  cold: "2mMinTemp_Regional_Monthly_2015_2025.csv",
} as const;
const soilFiles = { ph: "albay_ph_0-30cm_depthweightedmean.tif", sand: "albay_sand_0-30cm_depthweightedmean.tif", silt: "albay_silt_0-30cm_depthweightedmean.tif", clay: "albay_clay_0-30cm_depthweightedmean.tif" } as const;
let climateCache: Promise<Record<keyof typeof climateFiles, ClimateRow[]>> | undefined;
const rasterCache = new Map<string, ReturnType<typeof fromFile>>();
type ClimateRow = ClimateSample & { lat: number; lng: number; year: number };

function parseCsv(text: string): ClimateRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line && !line.startsWith("-") && !line.startsWith("PARAMETER"));
  return lines.map((line) => {
    const fields = line.split(",");
    const months = fields.slice(4, 16).map(Number);
    return { lat: Number(fields[2]), lng: Number(fields[3]), year: Number(fields[1]), months, mean: Number(fields[16]), max: Number(fields[16]), min: Number(fields[16]), rainfallTotal: months.reduce((a, b) => a + b, 0), source: "NASA POWER 2015–2025 regional monthly dataset" };
  }).filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lng) && row.months.length === 12 && row.months.every((value) => Number.isFinite(value) && value !== -999));
}

async function loadClimate() {
  if (!climateCache) climateCache = Promise.all(Object.entries(climateFiles).map(async ([key, file]) => [key, parseCsv(await fs.readFile(path.join(root, "climate", file), "utf8"))] as const)).then((entries) => Object.fromEntries(entries) as Record<keyof typeof climateFiles, ClimateRow[]>);
  return climateCache;
}

function nearestClimate(rows: ClimateRow[], lat: number, lng: number) {
  const nearestDistance = Math.min(...rows.map((row) => (row.lat - lat) ** 2 + (row.lng - lng) ** 2));
  const nearest = rows.filter((row) => (row.lat - lat) ** 2 + (row.lng - lng) ** 2 <= nearestDistance + 1e-8);
  const months = Array.from({ length: 12 }, (_, index) => {
    const values = nearest.map((row) => row.months[index]).filter(Number.isFinite);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  });
  return { ...nearest[0], months, mean: average(months), max: Math.max(...months), min: Math.min(...months), rainfallTotal: months.reduce((a, b) => a + b, 0), source: nearest[0]?.source ?? "NASA POWER regional dataset" };
}
const average = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

export async function sampleClimate(lat: number, lng: number): Promise<ClimateData> {
  const data = await loadClimate();
  return { rainfall: nearestClimate(data.rainfall, lat, lng), temperature: nearestClimate(data.temperature, lat, lng), heat: nearestClimate(data.heat, lat, lng), cold: nearestClimate(data.cold, lat, lng) };
}

async function sampleRaster(file: string, lat: number, lng: number) {
  let tif = rasterCache.get(file);
  if (!tif) { tif = fromFile(path.join(root, "soil", file)); rasterCache.set(file, tif); }
  const image = await tif.then((value) => value.getImage());
  const [minX, minY, maxX, maxY] = image.getBoundingBox();
  const [resX, resY] = image.getResolution();
  if (lng < minX || lng > maxX || lat < minY || lat > maxY) return null;
  const x = Math.max(0, Math.min(image.getWidth() - 1, Math.floor((lng - minX) / Math.abs(resX))));
  const y = Math.max(0, Math.min(image.getHeight() - 1, Math.floor((maxY - lat) / Math.abs(resY))));
  const values = await image.readRasters({ window: [x, y, x + 1, y + 1], width: 1, height: 1, interleave: true }) as unknown as number[];
  const value = values[0];
  const nodata = image.getGDALNoData();
  return Number.isFinite(value) && value !== nodata && value !== -999 ? value : null;
}

function classifyTexture(sand: number | null, silt: number | null, clay: number | null) {
  if (sand == null || silt == null || clay == null) return null;
  if (clay >= 40) return sand >= 45 ? "sandy clay" : silt >= 40 ? "silty clay" : "clay";
  if (clay >= 27) return sand >= 45 ? "sandy clay loam" : silt >= 40 ? "silty clay loam" : "clay loam";
  if (sand >= 70) return "sand";
  if (sand >= 43 && clay < 20) return "sandy loam";
  if (silt >= 50 && clay < 27) return "silt loam";
  return "loam";
}

export async function sampleSoil(lat: number, lng: number): Promise<SoilSample> {
  const [ph, sand, silt, clay] = await Promise.all([sampleRaster(soilFiles.ph, lat, lng), sampleRaster(soilFiles.sand, lat, lng), sampleRaster(soilFiles.silt, lat, lng), sampleRaster(soilFiles.clay, lat, lng)]);
  return { ph, sand, silt, clay, texture: classifyTexture(sand, silt, clay), source: "ISRIC SoilGrids-derived Albay 0–30 cm depth-weighted layers" };
}
