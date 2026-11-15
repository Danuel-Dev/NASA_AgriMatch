import { NextResponse } from "next/server";
import { sampleClimate, sampleSoil } from "@/lib/agri-data";
import { isSupportedPoint, type FarmDraft } from "@/lib/farm";
import { recommend } from "@/lib/recommendation-engine";

export async function POST(request: Request) {
  try {
    const farm = await request.json() as FarmDraft;
    if (!farm?.point || !isSupportedPoint(farm.point)) return NextResponse.json({ error: "Select a farm inside the Albay pilot area." }, { status: 400 });
    const [climate, soil] = await Promise.all([sampleClimate(farm.point.lat, farm.point.lng), sampleSoil(farm.point.lat, farm.point.lng)]);
    return NextResponse.json(recommend(farm, climate, soil));
  } catch (error) {
    console.error("Recommendation engine failed", error);
    return NextResponse.json({ error: "The environmental datasets could not be sampled." }, { status: 500 });
  }
}
