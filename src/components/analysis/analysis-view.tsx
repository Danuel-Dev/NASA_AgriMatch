"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFarm } from "@/components/farm/farm-provider";
import type { CropAssessment, RecommendationResult } from "@/lib/recommendation-engine";
import { FarmConditions, FarmSnapshot } from "./farm-snapshot";
import { RotationOption } from "./rotation-option";
import { useLanguage } from "@/components/language-provider";

export function AnalysisView() {
  const { farm } = useFarm();
  const { t } = useLanguage();
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!farm.point) return;
    let active = true;
    fetch("/api/recommend", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(farm) })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Recommendation failed.");
        return payload as RecommendationResult;
      })
      .then((payload) => { if (active) setResult(payload); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Recommendation failed."); });
    return () => { active = false; };
  }, [farm]);

  const sortedCrops = result ? [...result.crops].sort((a, b) => b.score - a.score) : [];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-headline">{t("compareRotations")}</h1>
          <p className="max-w-prose text-muted-foreground">{t("compareDescription")}</p>
        </div>
        <Link href="/#farm-workspace" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeft aria-hidden="true" />{t("editFarm")}
        </Link>
      </div>
      {error ? (
        <Alert variant="destructive" role="alert" className="py-3">
          <TriangleAlert aria-hidden="true" /><AlertTitle>Analysis could not be completed</AlertTitle><AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : !result ? (
        <Alert variant="default" role="status" className="py-3">
          <LoaderCircle className="animate-spin" aria-hidden="true" /><AlertTitle>{t("reading")}</AlertTitle><AlertDescription>{t("readingDescription")}</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="warning" role="note" className="py-3">
          <Info aria-hidden="true" /><AlertTitle>{t("screeningEstimate")}</AlertTitle><AlertDescription>{result.disclaimer}</AlertDescription>
        </Alert>
      )}
      <FarmSnapshot />
      {result && <div className="grid items-start gap-6 lg:grid-cols-2"><FarmConditions result={result} /><EnvironmentalPredictors result={result} /></div>}
      <section aria-labelledby="comparison-title" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="comparison-title" className="text-title">{t("rotationOptions")}</h2>
          <Badge variant="outline">{result ? t("calculated") : t("loadingOptions")}</Badge>
        </div>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {(result?.rotations ?? []).map((rotation) => <RotationOption key={rotation.id} rotation={rotation} recommended={rotation.id === result?.rotations.reduce((best, option) => option.score > best.score ? option : best, result.rotations[0]).id} />)}
        </div>
      </section>
      {result ? <EnvironmentalSummary crops={sortedCrops} /> : <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>}
      <p className="max-w-prose text-sm text-muted-foreground">Climate values come from the nearest supplied NASA POWER grid cell and 2015–2025 monthly history. Soil values are modeled estimates for the upper 30 cm, not field soil-test results.</p>
    </div>
  );
}

function EnvironmentalSummary({ crops }: { crops: CropAssessment[] }) {
  return <section aria-labelledby="crop-screening-title" className="space-y-4 border-y py-5">
    <div className="space-y-1"><h2 id="crop-screening-title" className="text-title">Crop suitability screening</h2><p className="text-sm text-muted-foreground">Seasonal rainfall warnings are shown beside each crop score.</p></div>
    <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
      {crops.map((assessment) => <CropResult key={assessment.crop} assessment={assessment} />)}
    </div>
  </section>;
}

function EnvironmentalPredictors({ result }: { result: RecommendationResult }) {
  return <section aria-labelledby="environment-title" className="space-y-4 border-y py-5">
    <div className="space-y-1"><h2 id="environment-title" className="text-title">Environmental predictors</h2><p className="text-sm text-muted-foreground">The climate and soil values used by the recommendation engine.</p></div>
    <div className="grid gap-3 md:grid-cols-3">
      <Metric label="Estimated annual rainfall" value={`${Math.round(result.climate.rainfall.rainfallTotal)} mm`} detail="12-month NASA POWER average" />
      <Metric label="Mean temperature" value={`${result.climate.temperature.mean.toFixed(1)}°C`} detail="Annual monthly average" />
      <Metric label="Estimated soil" value={result.soil.texture ?? "No estimate"} detail={result.soil.ph == null ? "No modeled value at this exact pin" : `pH ${result.soil.ph.toFixed(1)} · modeled`} />
    </div>
    {result.soil.ph == null && <Alert variant="warning" role="note" className="py-3"><Info aria-hidden="true" /><AlertTitle>Soil estimate unavailable at the exact pin</AlertTitle><AlertDescription>The supplied soil raster marks this pixel as NoData. Climate-based scores are still available; soil fit is treated as unknown rather than guessed.</AlertDescription></Alert>}
  </section>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold capitalize">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

function CropResult({ assessment }: { assessment: CropAssessment }) {
  return <Accordion className="rounded-lg border bg-card px-4">
    <AccordionItem value={assessment.crop}>
      <AccordionTrigger className="py-4 hover:no-underline">
        <span className="min-w-0 flex-1 text-left"><span className="block font-semibold">{assessment.crop}</span><span className="mt-1 block text-sm font-normal text-muted-foreground">Rainfall: {Math.round(assessment.rainfallTotal)} mm · Mean temperature: {assessment.meanTemperature.toFixed(1)}°C</span></span>
        <span className="shrink-0 pr-2 font-semibold tabular-nums text-primary">{assessment.score}/100</span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <p className="text-sm"><span className="font-medium">Seasonal warning: </span>{assessment.warning}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ScoreFactor label="Rainfall fit" value={assessment.rainfallScore} detail={`${Math.round(assessment.rainfallTotal)} mm estimated · preferred ${assessment.rainfallRange}`} />
          <ScoreFactor label="Temperature fit" value={assessment.temperatureScore} detail={`${assessment.meanTemperature.toFixed(1)}°C mean · ${assessment.maxTemperature.toFixed(1)}°C maximum`} />
          <ScoreFactor label="Soil fit" value={assessment.soilScore} detail="Based on sampled pH and derived texture" />
          <ScoreFactor label="Water fit" value={assessment.waterScore} detail={`${assessment.rule.waterDemand} water-demand crop · ${assessment.rule.name}`} />
        </div>
        <div className="space-y-2 border-t pt-3 text-sm">
          <p className="font-medium">Why this score?</p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {assessment.notes.map((note) => <li key={note}>{note}</li>)}
            {assessment.soilScore === 60 && <li>Soil data is unavailable at the exact pin, so soil fit is treated as unknown rather than guessed.</li>}
            {assessment.score < 100 && <li>The score combines multiple factors; a strong result in one factor does not remove limitations in another.</li>}
          </ul>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>;
}

function ScoreFactor({ label, value, detail }: { label: string; value: number; detail: string }) {
  return <div className="rounded-md bg-muted p-3"><div className="flex items-baseline justify-between gap-2"><span className="font-medium">{label}</span><span className="font-semibold tabular-nums text-primary">{value}/100</span></div><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

