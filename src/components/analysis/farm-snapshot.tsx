"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FarmMap } from "@/components/farm/farm-map";
import { useFarm } from "@/components/farm/farm-provider";
import { formatCoordinates } from "@/lib/farm";
import { CROP_LABELS_FIL, PRIORITY_LABELS_FIL } from "@/lib/farm";
import type { RecommendationResult } from "@/lib/recommendation-engine";
import { useLanguage } from "@/components/language-provider";

export function FarmSnapshot() {
  const { farm } = useFarm();
  const { language, t } = useLanguage();

  return (
    <section aria-label="Your farm snapshot" className="border-y py-4">
      {farm.point ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div className="min-w-0 space-y-1">
              <h2 className="text-base font-semibold">{t("selectedFarm")}</h2>
              <p className="wrap-anywhere font-mono text-sm tabular-nums">{formatCoordinates(farm.point)}</p>
            </div>
            <p className="wrap-anywhere text-sm text-muted-foreground">{t("pilot")}</p>
          </div>
          <div className="pt-2">
            <FarmMap point={farm.point} className="h-64 lg:h-[22rem]" />
          </div>
        </div>
      ) : (
        <Empty className="items-start gap-3 p-0 text-left md:p-0">
          <EmptyHeader className="max-w-none flex-row items-start gap-3 text-left">
            <EmptyMedia variant="icon"><MapPin aria-hidden="true" /></EmptyMedia>
            <div className="space-y-1">
              <EmptyTitle>{t("noFarm")}</EmptyTitle>
              <EmptyDescription>{language === "fil" ? "Mga halimbawang rotation ito. Pumili ng bukid upang idagdag ang lokasyon at mga prayoridad." : "These are sample rotations. Choose a farm to add your location and preferences."}</EmptyDescription>
            </div>
          </EmptyHeader>
          <EmptyContent className="max-w-none items-start">
            <Link href="/#farm-workspace" className={buttonVariants({ variant: "outline" })}>{t("chooseFarm")}</Link>
          </EmptyContent>
        </Empty>
      )}
    </section>
  );
}

export function FarmConditions({ result }: { result?: RecommendationResult | null }) {
  const { farm } = useFarm();
  const { language, t } = useLanguage();
  return <section aria-labelledby="farm-conditions-title" className="space-y-2 border-y py-3">
    <h2 id="farm-conditions-title" className="text-lg font-semibold">{t("farmConditions")} {language === "fil" ? "at mga prayoridad" : "and priorities"}</h2>
    <div className="grid items-start gap-3 lg:grid-cols-2 lg:gap-5">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">{t("farmConditions")}</h3>
        <dl className="space-y-1 text-xs">
          {[["Soil texture", farm.soil], ["Irrigation", farm.irrigation], ["Season", farm.season]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></div>)}
          {result?.soil.ph != null && <div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-muted-foreground">Sampled soil pH</dt><dd className="font-medium">{result.soil.ph.toFixed(1)}</dd></div>}
          {result?.soil.texture && <div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-muted-foreground">Derived texture</dt><dd className="font-medium">{result.soil.texture}</dd></div>}
          {result && result.soil.ph == null && <div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-muted-foreground">Soil estimate</dt><dd className="font-medium">NoData at exact pin</dd></div>}
        </dl>
      </div>
      <div className="space-y-3">
        <div className="space-y-1"><h3 className="text-sm font-semibold">{t("current")}</h3><div className="flex flex-wrap gap-1" aria-label={t("current")}>{farm.currentRotation.map((crop, index) => <Badge key={`${crop}-${index}`} variant="crop" className="px-2 py-1 text-xs">{language === "fil" ? "Panahon" : "Period"} {index + 1}: {language === "fil" ? CROP_LABELS_FIL[crop] : crop}</Badge>)}</div></div>
        <div className="space-y-1"><h3 className="text-sm font-semibold">{t("yourPriorities")}</h3><div className="flex flex-wrap gap-1">{farm.priorities.map((priority) => <Badge key={priority} variant="secondary" className="px-2 py-1 text-xs">{language === "fil" ? PRIORITY_LABELS_FIL[priority] : priority}</Badge>)}</div></div>
      </div>
    </div>
  </section>;
}
