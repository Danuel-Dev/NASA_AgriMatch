"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Rotation } from "@/lib/rotations";
import { useFarm } from "@/components/farm/farm-provider";
import type { RecommendationResult } from "@/lib/recommendation-engine";
import { useLanguage } from "@/components/language-provider";
import { CROP_LABELS_FIL } from "@/lib/farm";

const cropImages: Record<string, string> = { Rice: "/crops/rice.avif", Corn: "/crops/mais.jpg", "Mung bean": "/crops/monggo.jpg", "Sweet potato": "/crops/kamote.jpg", Eggplant: "/crops/talong.jpg", "Yardlong bean": "/crops/sitaw.avif", Peanut: "/crops/mani.jpg" };

export function RotationDetail({ rotation: initialRotation }: { rotation: Rotation }) {
  const { farm } = useFarm();
  const { language, t } = useLanguage();
  const isFil = language === "fil";
  const [current, setCurrent] = useState(initialRotation);

  useEffect(() => {
    if (!farm.point) return;
    let active = true;
    fetch("/api/recommend", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(farm) })
      .then((response) => response.json() as Promise<RecommendationResult>)
      .then((result) => {
        const match = result.rotations.find((option) => option.id === initialRotation.id);
        if (active && match) setCurrent(match);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [farm, initialRotation.id]);

  const rotation = current;
  const localizedCrops = rotation.crops.map((crop) => isFil ? (CROP_LABELS_FIL[crop] ?? crop) : crop);
  const localizedName = isFil ? ({ "option-1": "Rotation na Tipid-Tubig", "option-2": "Rotation na Tagapagpaunlad ng Lupa", "option-3": "Rotation na Angkop sa Klima" }[rotation.id] ?? rotation.name) : rotation.name;
  const localizedExplanation = isFil ? ({ "option-1": "Isang planong nakatuon sa pagtitipid ng tubig habang pinananatiling angkop sa klima.", "option-2": "Isang alternatibong nagbibigay ng higit na bigat sa kalusugan ng lupa sa pagitan ng mga panahon ng produksyon.", "option-3": "Isang alternatibong binabalanse ang pagiging angkop sa klima at sari-saring pananim." }[rotation.id] ?? rotation.explanation) : rotation.explanation;
  const localizedTradeoff = isFil ? ({ "option-1": "Maaaring magbago ang produksyon sa mga panahong hindi karaniwang tuyo.", "option-2": "Maaaring mangailangan ito ng dagdag na pagpaplano at pansamantalang pananim na mas mababa ang balik.", "option-3": "Maaaring mangailangan ang iba't ibang pananim ng iba't ibang paraan ng pangangalaga." }[rotation.id] ?? rotation.tradeoff) : rotation.tradeoff;
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href="/analysis" className={buttonVariants({ variant: "link", className: "px-0" })}>
          <ArrowLeft aria-hidden="true" />{language === "fil" ? "Bumalik sa paghahambing" : "Back to comparison"}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-prose space-y-2">
            <h1 className="text-headline">{localizedName}</h1>
            <p className="text-muted-foreground">{localizedExplanation}</p>
          </div>
          <Badge variant={`rotation-${rotation.tone}`} className="gap-2">
            <span className="text-xl font-semibold tabular-nums">{rotation.score}</span>
            <span>{isFil ? "/100 score ng pagiging angkop" : "/100 screening score"}</span>
          </Badge>
        </div>
      </div>
      <Alert variant="warning" role="note" className="py-3">
        <Info aria-hidden="true" />
        <AlertTitle>{t("screeningEstimate")}</AlertTitle>
        <AlertDescription>{isFil ? "Ang rotation na ito ay kinakalkula mula sa napiling lokasyon ng bukid, ibinigay na climate grid ng NASA, modelong mga layer ng lupa, access sa patubig, at mga napiling prayoridad. Hindi ito garantisadong pagtataya ng ani." : "This rotation is calculated from the selected farm location, supplied NASA climate grid, modeled soil layers, irrigation access, and selected priorities. It is not a guaranteed yield prediction."}</AlertDescription>
      </Alert>
      <div className="grid gap-6 border-t pt-6 lg:grid-cols-2 lg:gap-12">
        <section aria-labelledby="sequence-title" className="space-y-4">
          <div className="space-y-1">
            <h2 id="sequence-title" className="text-title">{language === "fil" ? "Pagkakasunod-sunod ng pananim" : "Crop sequence"}</h2>
            <p className="text-sm text-muted-foreground">{language === "fil" ? "Ang ayos ng mga pananim sa tatlong panahon ng pagtatanim sa rotation na ito." : "The order of crops across three growing periods in this screening rotation."}</p>
          </div>
          <ol className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2">
            {localizedCrops.map((crop, index) => (
              <li key={crop} className="contents">
                <div className="min-w-0 text-center">
                  <CropIcon crop={rotation.crops[index]} />
                  <Badge variant="secondary" className="mt-2 text-[11px]">{isFil ? "Hakbang" : "Step"} {index + 1}</Badge>
                  <p className="mt-1 truncate font-semibold">{crop}</p>
                </div>
                {index < rotation.crops.length - 1 && <ArrowRight className="mt-8 size-4 shrink-0 text-primary" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="strengths-title" className="space-y-4">
          <h2 id="strengths-title" className="text-title">{isFil ? "Bakit ang mga pananim na ito?" : "Why use these crops?"}</h2>
          <ul className="max-w-prose space-y-3">
            {rotation.strengths.map((strength) => (
              <li key={strength} className="flex items-start gap-2">
                <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
                <span>{isFil ? translateStrength(strength) : strength}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Alert variant="explanation" role="note">
        <TriangleAlert aria-hidden="true" />
        <AlertTitle>{isFil ? "Kapalit na dapat isaalang-alang" : "Trade-off to consider"}</AlertTitle>
        <AlertDescription>
          <p>{localizedTradeoff}</p>
          <div className="mt-4 space-y-3" aria-label={isFil ? "Pagganap ayon sa prayoridad" : "Priority performance"}>
            <p className="font-medium text-foreground">{isFil ? "Paano tumutugma ang rotation sa iyong mga prayoridad" : "How this rotation fits your priorities"}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(rotation.priorityMetrics ?? []).map((metric) => (
                <div key={metric.label} className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
                  <span className="text-foreground">{isFil ? ({ "Water fit": "Angkop sa tubig", "Soil health": "Kalusugan ng lupa", "Climate fit": "Angkop sa klima", "Heat resilience": "Tibay sa init" }[metric.label] ?? metric.label) : metric.label}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-label={`${metric.label} fit`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metric.value}>
                    <div className={`h-full rounded-full ${metric.tone === "blue" ? "bg-chart-1" : metric.tone === "green" ? "bg-chart-2" : metric.tone === "pink" ? "bg-chart-3" : "bg-warning"}`} style={{ width: `${metric.value}%` }} />
                  </div>
                  <span className="text-right font-semibold tabular-nums text-foreground">{metric.value}%</span>
                </div>
              ))}
            </div>
            <p className="text-xs">{isFil ? "Mas mataas na porsyento ang nagpapahiwatig ng mas mahusay na pagtutugma sa nasuring kondisyon ng bukid; mga palatandaan lamang ito sa screening, hindi pagtataya ng ani o kita." : "Higher percentages indicate better alignment with the sampled farm conditions; they are screening indicators, not yield or income predictions."}</p>
          </div>
          <p>{isFil ? "Gamitin ang mga paliwanag na ito bilang gabay sa screening at patunayan ang pagpili sa pamamagitan ng pagmamasid sa bukid, pagsusuri ng lupa, at payo ng lokal na agronomo." : "Use these explanations as screening guidance and validate the choice with field observations, soil testing, and local agronomic advice."}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function CropIcon({ crop }: { crop: string }) {
  return <span className="relative block h-16 w-full overflow-hidden rounded-2xl bg-accent sm:h-20"><Image src={cropImages[crop] ?? cropImages.Rice} alt={`${crop} crop`} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" /></span>;
}

function translateStrength(text: string) {
  return text
    .replace("Lower estimated water pressure", "Mas mababang tinatayang pangangailangan sa tubig")
    .replace("Good fit for rain-fed planning", "Angkop sa pagpaplanong umaasa sa ulan")
    .replace("Keeps multiple crop options available", "Nagpapanatili ng maraming pagpipiliang pananim")
    .replace("Includes a soil-restoring crop", "May pananim na tumutulong sa pagpapanumbalik ng lupa")
    .replace("Supports crop diversity", "Sinusuportahan ang pagkakaiba-iba ng pananim")
    .replace("May improve long-term soil condition", "Maaaring mapabuti ang pangmatagalang kondisyon ng lupa")
    .replace("Diversifies farm production", "Pinag-iiba ang produksyon ng bukid")
    .replace("Balances climate suitability", "Binabalanse ang pagiging angkop sa klima")
    .replace("Offers several harvest windows", "Nag-aalok ng maraming panahon ng pag-aani")
    .replace("temperature is within its preferred range", "pasok ang temperatura sa angkop na saklaw")
    .replace("its low water demand matches the farm access", "tugma ang mababang pangangailangan sa tubig sa access ng bukid")
    .replace("its medium water demand matches the farm access", "tugma ang katamtamang pangangailangan sa tubig sa access ng bukid")
    .replace("it can contribute to soil-health planning", "makatutulong ito sa pagpaplano ng kalusugan ng lupa")
    .replace("it remains a possible option, although one or more conditions need attention", "maaari pa rin itong opsyon, ngunit kailangang bigyang-pansin ang isa o higit pang kondisyon");
}

