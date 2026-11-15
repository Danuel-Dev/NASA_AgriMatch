"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FarmMap } from "@/components/farm/farm-map";
import { useFarm } from "@/components/farm/farm-provider";
import { formatCoordinates } from "@/lib/farm";
import type { RecommendationResult } from "@/lib/recommendation-engine";

export function FarmSnapshot() {
  const { farm } = useFarm();

  return (
    <section aria-label="Your farm snapshot" className="border-y py-4">
      {farm.point ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div className="min-w-0 space-y-1">
              <h2 className="text-base font-semibold">Selected farm</h2>
              <p className="wrap-anywhere font-mono text-sm tabular-nums">{formatCoordinates(farm.point)}</p>
            </div>
            <p className="wrap-anywhere text-sm text-muted-foreground">Albay pilot area</p>
          </div>
          <div className="pt-2">
            <FarmMap point={farm.point} className="h-64 lg:h-80" />
          </div>
        </div>
      ) : (
        <Empty className="items-start gap-3 p-0 text-left md:p-0">
          <EmptyHeader className="max-w-none flex-row items-start gap-3 text-left">
            <EmptyMedia variant="icon"><MapPin aria-hidden="true" /></EmptyMedia>
            <div className="space-y-1">
              <EmptyTitle>No farm selected</EmptyTitle>
              <EmptyDescription>These are sample rotations. Choose a farm to add your location and preferences.</EmptyDescription>
            </div>
          </EmptyHeader>
          <EmptyContent className="max-w-none items-start">
            <Link href="/#farm-workspace" className={buttonVariants({ variant: "outline" })}>Choose a farm</Link>
          </EmptyContent>
        </Empty>
      )}
    </section>
  );
}

export function FarmConditions({ result }: { result?: RecommendationResult | null }) {
  const { farm } = useFarm();
  return <section aria-labelledby="farm-conditions-title" className="space-y-4 border-y py-5">
    <h2 id="farm-conditions-title" className="text-title">Farm conditions and priorities</h2>
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Farm conditions</h3>
        <dl className="space-y-2 text-sm">
          {[["Soil texture", farm.soil], ["Irrigation", farm.irrigation], ["Season", farm.season]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></div>)}
          {result?.soil.ph != null && <div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-muted-foreground">Sampled soil pH</dt><dd className="font-medium">{result.soil.ph.toFixed(1)}</dd></div>}
          {result?.soil.texture && <div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-muted-foreground">Derived texture</dt><dd className="font-medium">{result.soil.texture}</dd></div>}
          {result && result.soil.ph == null && <div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-muted-foreground">Soil estimate</dt><dd className="font-medium">NoData at exact pin</dd></div>}
        </dl>
      </div>
      <div className="space-y-4">
        <div className="space-y-2"><h3 className="text-base font-semibold">Current rotation</h3><div className="flex flex-wrap gap-2" aria-label="Current crop rotation">{farm.currentRotation.map((crop, index) => <Badge key={`${crop}-${index}`} variant="crop">Period {index + 1}: {crop}</Badge>)}</div></div>
        <div className="space-y-2"><h3 className="text-base font-semibold">Your priorities</h3><div className="flex flex-wrap gap-2">{farm.priorities.map((priority) => <Badge key={priority} variant="secondary">{priority}</Badge>)}</div></div>
      </div>
    </div>
  </section>;
}
