"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, HelpCircle, Info, LoaderCircle, RefreshCw, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFarm } from "@/components/farm/farm-provider";
import type { CropAssessment, RecommendationResult } from "@/lib/recommendation-engine";
import { CROP_LABELS_FIL, SOIL_LABELS_FIL } from "@/lib/farm";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{language === "fil" ? "Magkatabing paghahambing" : "Side-by-side"}</p>
          <h1 className="text-headline">{language === "fil" ? "Ihambing ang iyong mga rotation" : "Compare your rotations"}</h1>
          <p className="max-w-prose text-muted-foreground">{language === "fil" ? "Ihambing ang tatlong rotation." : "Compare three crop rotations."}</p>
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
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <FarmSnapshot />
        <div className="space-y-6">
          {result && <FarmConditions result={result} />}
          {result && <EnvironmentalPredictors result={result} />}
        </div>
      </div>
      <section aria-labelledby="comparison-title" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="comparison-title" className="text-title">{t("rotationOptions")}</h2>
          <Badge variant="outline">{result ? t("calculated") : t("loadingOptions")}</Badge>
        </div>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {(result?.rotations ?? []).map((rotation) => <RotationOption key={rotation.id} rotation={rotation} recommended={rotation.id === result?.rotations.reduce((best, option) => option.score > best.score ? option : best, result.rotations[0]).id} />)}
        </div>
        {result && <TradeoffTable rotations={result.rotations} />}
        <div className="flex justify-center pt-2">
          <Link href="/?start=1" className={buttonVariants({ className: "h-16 min-w-72 rounded-2xl px-8 text-lg" })}>
            {language === "fil" ? "Magplano ng ibang bukid" : "Plan another farm"} <RefreshCw aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function TradeoffTable({ rotations }: { rotations: RecommendationResult["rotations"] }) {
  const { language } = useLanguage();
  const isFil = language === "fil";
  const columns = rotations.slice(0, 3);
  const rows = [
    { label: isFil ? "💧 Tubig" : "💧 Water", values: columns.map((rotation) => rotation.priorityMetrics.find((metric) => metric.label === "Water fit")?.value && (rotation.priorityMetrics.find((metric) => metric.label === "Water fit")!.value >= 85 ? (isFil ? "Mas mababa" : "Potentially lower") : (isFil ? "Suriin ang yugto" : "Check crop stage"))) },
    { label: isFil ? "🌱 Lupa" : "🌱 Soil", values: columns.map((rotation) => rotation.priorityMetrics.find((metric) => metric.label === "Soil health")?.value && (rotation.priorityMetrics.find((metric) => metric.label === "Soil health")!.value >= 80 ? (isFil ? "Potensyal ng legume" : "Legume potential") : (isFil ? "Batayan ng kasalukuyan" : "Current baseline"))) },
    { label: isFil ? "👩‍🌾 Pagsisikap sa bukid" : "👩‍🌾 Farm effort", values: columns.map((rotation, index) => index === 0 ? (isFil ? "Pamilyar na gawain" : "Familiar routine") : (isFil ? "Bagong pananim na aaralin" : "New crop to learn")) },
    { label: isFil ? "🔄 Ano ang nagbabago" : "🔄 What changes", values: columns.map((_, index) => index === 0 ? (isFil ? "Walang pagbabago" : "No change") : index === 1 ? (isFil ? "Bagong halo" : "New mix") : (isFil ? "Binagong pagkakasunod" : "Reordered crops")) },
  ];
  return <section aria-labelledby="tradeoff-table-title" className="mt-8 rounded-3xl border bg-card p-5 sm:p-8"><div className="space-y-2"><h2 id="tradeoff-table-title" className="text-title">⚖️ {isFil ? "Aling mga kapalit ang mahalaga sa iyo?" : "Which trade-offs matter to you?"}</h2><p className="text-muted-foreground">{isFil ? "Nag-aalok ang bawat opsyon ng ibang benepisyo at limitasyon. Ihambing ang mga ito bago pumili ng plano sa pagtatanim." : "Each option offers different benefits and compromises. Compare them before choosing a planting plan."}</p></div><div className="mt-6 overflow-x-auto"><div className="min-w-[720px] space-y-3"><div className="grid grid-cols-[12rem_repeat(3,minmax(0,1fr))] gap-px overflow-hidden rounded-2xl bg-border text-sm font-semibold"><div className="bg-secondary p-4">{isFil ? "Ihambing" : "Compare"}</div>{columns.map((rotation, index) => <div key={rotation.id} className="bg-secondary p-4">{index === 0 ? (isFil ? "Iyong kasalukuyang plano" : "Your current plan") : index === 1 ? "Alternative A" : "Alternative B"}</div>)}</div>{rows.map((row) => <div key={row.label} className="grid grid-cols-[12rem_repeat(3,minmax(0,1fr))] gap-px overflow-hidden rounded-2xl bg-border text-sm"><div className="bg-muted p-4 font-semibold text-foreground">{row.label}</div>{row.values.map((value, index) => <div key={`${row.label}-${index}`} className="bg-card p-4 text-muted-foreground">{value}</div>)}</div>)}</div></div><p className="mt-5 text-sm text-muted-foreground">{isFil ? "Mga halimbawang tendensya lamang ito. Hindi ito beripikadong pagtitipid sa tubig, pagbabago sa ani, o pagbuti ng lupa." : "Illustrative tendencies only. These are not verified water savings, yield changes, or soil improvements."}</p></section>;
}

function EnvironmentalPredictors({ result }: { result: RecommendationResult }) {
  const { language } = useLanguage();
  const isFil = language === "fil";
  const [showHelp, setShowHelp] = useState(false);
  return <section aria-labelledby="environment-title" className="space-y-1 border-y py-1.5">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h2 id="environment-title" className="text-base font-semibold">{isFil ? "Mga salik sa kapaligiran" : "Environmental predictors"}</h2>
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
      <p className="text-xs text-muted-foreground">{isFil ? "Mga halaga ng klima at lupa na ginamit ng makina ng rekomendasyon." : "The climate and soil values used by the recommendation engine."}</p>
    </div>
    <div className="grid gap-2 md:grid-cols-3">
      <Metric label={isFil ? "Tinatayang taunang ulan" : "Estimated annual rainfall"} value={`${Math.round(result.climate.rainfall.rainfallTotal)} mm`} detail={isFil ? "12-buwang average mula sa NASA POWER" : "12-month NASA POWER average"} />
      <Metric label={isFil ? "Katamtamang temperatura" : "Mean temperature"} value={`${result.climate.temperature.mean.toFixed(1)}°C`} detail={isFil ? "Taunang average ng mga buwan" : "Annual monthly average"} />
      <Metric label={isFil ? "Tinatayang lupa" : "Estimated soil"} value={result.soil.texture ? (isFil ? (SOIL_LABELS_FIL[result.soil.texture] ?? result.soil.texture) : result.soil.texture) : (isFil ? "Walang pagtatantiya" : "No estimate")} detail={result.soil.ph == null ? (isFil ? "Walang modelong halaga sa eksaktong pin na ito" : "No modeled value at this exact pin") : `pH ${result.soil.ph.toFixed(1)} · ${isFil ? "modelo" : "modeled"}`} />
    </div>
    {result.soil.ph == null && <Alert variant="warning" role="note" className="py-3"><Info aria-hidden="true" /><AlertTitle>Soil estimate unavailable at the exact pin</AlertTitle><AlertDescription>The supplied soil raster marks this pixel as NoData. Climate-based scores are still available; soil fit is treated as unknown rather than guessed.</AlertDescription></Alert>}
  </section>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-lg border bg-card p-2"><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-0.5 text-base font-semibold">{value}</p><p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{detail}</p></div>;
}

export function CropResult({ assessment }: { assessment: CropAssessment }) {
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

