import { NextResponse } from "next/server";
import { sampleClimate, sampleSoil } from "@/lib/agri-data";
import { isSupportedPoint, type FarmDraft } from "@/lib/farm";
import { recommend } from "@/lib/recommendation-engine";
import { loadCropRules } from "@/lib/crop-rules";

export async function POST(request: Request) {
  try {
    const farm = await request.json() as FarmDraft;
    if (!farm?.point || !isSupportedPoint(farm.point)) return NextResponse.json({ error: "Select a farm inside the Albay pilot area." }, { status: 400 });
    if (!Array.isArray(farm.currentRotation) || farm.currentRotation.length !== 3 || farm.currentRotation.some((crop) => typeof crop !== "string")) return NextResponse.json({ error: "Choose a three-period current rotation." }, { status: 400 });
    const [climate, soil] = await Promise.all([sampleClimate(farm.point.lat, farm.point.lng), sampleSoil(farm.point.lat, farm.point.lng)]);
    return NextResponse.json(recommend(farm, climate, soil, await loadCropRules()));
  } catch (error) {
    console.error("Recommendation engine failed", error);
    return NextResponse.json({ error: "The environmental datasets could not be sampled." }, { status: 500 });
  }
}
