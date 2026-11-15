"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, HelpCircle, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFarm } from "@/components/farm/farm-provider";
import type { CropAssessment, RecommendationResult } from "@/lib/recommendation-engine";
import { CROP_LABELS_FIL } from "@/lib/farm";
import { FarmConditions, FarmSnapshot } from "./farm-snapshot";
import { RotationOption } from "./rotation-option";
import { useLanguage } from "@/components/language-provider";

export function AnalysisView() {
  const { farm } = useFarm();
  const { t, language } = useLanguage();
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
      <p className="max-w-prose text-sm text-muted-foreground">{language === "fil" ? "Ang mga halaga ng klima ay mula sa pinakamalapit na NASA POWER-derived grid cell at buwanang kasaysayan ng 2015–2025. Ang halaga ng lupa ay modelo para sa itaas na 30 cm, hindi resulta ng field soil test." : "Climate values come from the nearest supplied NASA POWER grid cell and 2015–2025 monthly history. Soil values are modeled estimates for the upper 30 cm, not field soil-test results."}</p>
    </div>
  );
}

function EnvironmentalSummary({ crops }: { crops: CropAssessment[] }) {
  return <section aria-labelledby="crop-screening-title" className="space-y-4 border-y py-5">
    <div className="space-y-1"><h2 id="crop-screening-title" className="text-title">{useLanguage().t("cropScreening")}</h2><p className="text-sm text-muted-foreground">{useLanguage().language === "fil" ? "Makikita ang mga babala sa pana-panahong ulan sa tabi ng score ng bawat pananim." : "Seasonal rainfall warnings are shown beside each crop score."}</p></div>
    <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
      {crops.map((assessment) => <CropResult key={assessment.crop} assessment={assessment} />)}
    </div>
  </section>;
}

function EnvironmentalPredictors({ result }: { result: RecommendationResult }) {
  const { language } = useLanguage();
  const isFil = language === "fil";
  const [showHelp, setShowHelp] = useState(false);
  return <section aria-labelledby="environment-title" className="space-y-4 border-y py-5">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h2 id="environment-title" className="text-title">{isFil ? "Mga salik sa kapaligiran" : "Environmental predictors"}</h2>
        <span className="group relative inline-flex">
          <button
            type="button"
            className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isFil ? "Ipaliwanag ang mga salik sa kapaligiran" : "Explain environmental predictors"}
            aria-expanded={showHelp}
            onClick={() => setShowHelp((visible) => !visible)}
          >
            <HelpCircle className="size-4" aria-hidden="true" />
          </button>
          <span className={`${showHelp ? "block" : "hidden"} pointer-events-none absolute left-0 top-8 z-10 w-72 rounded-md border bg-popover p-3 text-left text-xs font-normal leading-relaxed text-popover-foreground shadow-md group-hover:block group-focus-within:block`} role="tooltip">
            {isFil ? "Ipinapakita rito ang mga tinatayang halaga ng ulan, temperatura, at lupa na ginagamit sa pagsusuri ng mga pananim. Gabay lamang ang mga ito at hindi kapalit ng pagsusuri sa bukid." : "These are estimated rainfall, temperature, and soil values used to screen the crops. They are guidance only and do not replace field testing."}
          </span>
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{isFil ? "Mga halaga ng klima at lupa na ginamit ng makina ng rekomendasyon." : "The climate and soil values used by the recommendation engine."}</p>
    </div>
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
  const { language } = useLanguage();
  const isFil = language === "fil";
  const cropName = isFil ? (CROP_LABELS_FIL[assessment.crop] ?? assessment.crop) : assessment.crop;
  if (isFil) assessment = { ...assessment, crop: cropName };
  const warning = isFil ? translateWarning(assessment.warning) : assessment.warning;
  return <Accordion className="rounded-lg border bg-card px-4">
    <AccordionItem value={assessment.crop}>
      <AccordionTrigger className="py-4 hover:no-underline">
        <span className="min-w-0 flex-1 text-left"><span className="block font-semibold">{assessment.crop}</span><span className="mt-1 block text-sm font-normal text-muted-foreground">{isFil ? "Ulan" : "Rainfall"}: {Math.round(assessment.rainfallTotal)} mm · {isFil ? "Katamtamang temperatura" : "Mean temperature"}: {assessment.meanTemperature.toFixed(1)}°C</span></span>
        <span className="shrink-0 pr-2 font-semibold tabular-nums text-primary">{assessment.score}/100</span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4">
        <p className="text-sm"><span className="font-medium">{isFil ? "Babala sa panahon ng pagtatanim:" : "Seasonal warning:"} </span>{warning}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ScoreFactor label={isFil ? "Angkop sa ulan" : "Rainfall fit"} value={assessment.rainfallScore} detail={isFil ? `${Math.round(assessment.rainfallTotal)} mm tinatayang · angkop na ${assessment.rainfallRange}` : `${Math.round(assessment.rainfallTotal)} mm estimated · preferred ${assessment.rainfallRange}`} />
          <ScoreFactor label={isFil ? "Angkop sa temperatura" : "Temperature fit"} value={assessment.temperatureScore} detail={isFil ? `${assessment.meanTemperature.toFixed(1)}°C karaniwan · ${assessment.maxTemperature.toFixed(1)}°C pinakamataas` : `${assessment.meanTemperature.toFixed(1)}°C mean · ${assessment.maxTemperature.toFixed(1)}°C maximum`} />
          <ScoreFactor label={isFil ? "Angkop sa lupa" : "Soil fit"} value={assessment.soilScore} detail={isFil ? "Batay sa nasuring pH at nabuong tekstura" : "Based on sampled pH and derived texture"} />
          <ScoreFactor label={isFil ? "Angkop sa tubig" : "Water fit"} value={assessment.waterScore} detail={isFil ? `${assessment.rule.waterDemand} pangangailangan sa tubig · ${assessment.rule.name}` : `${assessment.rule.waterDemand} water-demand crop · ${assessment.rule.name}`} />
        </div>
        <div className="space-y-2 border-t pt-3 text-sm">
          <p className="font-medium">{isFil ? "Bakit ganito ang score?" : "Why this score?"}</p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {assessment.notes.map((note) => <li key={note}>{isFil ? translateNote(note) : note}</li>)}
            {assessment.soilScore === 60 && <li>{isFil ? "Walang datos ng lupa sa eksaktong pin; itinuturing na hindi alam ang angkop sa lupa sa halip na hulaan." : "Soil data is unavailable at the exact pin, so soil fit is treated as unknown rather than guessed."}</li>}
            {assessment.score < 100 && <li>{isFil ? "Pinagsasama ng score ang maraming salik; hindi inaalis ng magandang resulta sa isang salik ang mga limitasyon sa iba." : "The score combines multiple factors; a strong result in one factor does not remove limitations in another."}</li>}
          </ul>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>;
}

function translateWarning(text: string) {
  return text
    .replace("No major seasonal rainfall warning detected.", "Walang nakitang malaking babala sa pana-panahong ulan.")
    .replace("Rainfall may be insufficient during the growing period.", "Maaaring kulang ang ulan sa panahon ng pagtatanim.")
    .replace("Rainfall may exceed the preferred growing-period range.", "Maaaring lumampas ang ulan sa angkop na saklaw sa panahon ng pagtatanim.")
    .replace("Seasonal rainfall is adequate, but heat-stress risk should be monitored.", "Sapat ang pana-panahong ulan, ngunit dapat bantayan ang posibilidad ng stress sa init.");
}

function translateNote(text: string) {
  return text
    .replace(/Estimated seasonal rainfall is (.+) for (.+)\./, "Tinatayang pana-panahong ulan: $1 sa loob ng $2.")
    .replace(/Estimated soil pH (.+) is outside the preferred (.+) range\./, "Ang tinatayang pH ng lupa na $1 ay nasa labas ng angkop na saklaw na $2.")
    .replace(/Estimated (.+) texture is not the preferred texture for this crop\./, "Ang tinatayang tekstura na $1 ay hindi ang pinakanaaangkop para sa pananim na ito.")
    .replace(/Maximum temperature reaches (.+); heat-stress risk is possible\./, "Umaabot sa $1 ang pinakamataas na temperatura; posibleng magkaroon ng stress sa init.");
}

function ScoreFactor({ label, value, detail }: { label: string; value: number; detail: string }) {
  return <div className="rounded-md bg-muted p-3"><div className="flex items-baseline justify-between gap-2"><span className="font-medium">{label}</span><span className="font-semibold tabular-nums text-primary">{value}/100</span></div><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

