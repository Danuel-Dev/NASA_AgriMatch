"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Rotation } from "@/lib/rotations";
import { useFarm } from "@/components/farm/farm-provider";
import type { RecommendationResult } from "@/lib/recommendation-engine";

export function RotationDetail({ rotation: initialRotation }: { rotation: Rotation }) {
  const { farm } = useFarm();
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
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href="/analysis" className={buttonVariants({ variant: "link", className: "px-0" })}>
          <ArrowLeft aria-hidden="true" />Back to comparison
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-prose space-y-2">
            <h1 className="text-headline">{rotation.name}</h1>
            <p className="text-muted-foreground">{rotation.explanation}</p>
          </div>
          <Badge variant={`rotation-${rotation.tone}`} className="gap-2">
            <span className="text-xl font-semibold tabular-nums">{rotation.score}</span>
            <span>/100 screening score</span>
          </Badge>
        </div>
      </div>
      <Alert variant="warning" role="note" className="py-3">
        <Info aria-hidden="true" />
        <AlertTitle>Screening estimate</AlertTitle>
        <AlertDescription>This rotation is calculated from the selected farm location, supplied NASA climate grid, modeled soil layers, irrigation access, and selected priorities. It is not a guaranteed yield prediction.</AlertDescription>
      </Alert>
      <div className="grid gap-6 border-t pt-6 lg:grid-cols-2 lg:gap-12">
        <section aria-labelledby="sequence-title" className="space-y-4">
          <div className="space-y-1">
            <h2 id="sequence-title" className="text-title">Crop sequence</h2>
            <p className="text-sm text-muted-foreground">The order of crops in this screening rotation.</p>
          </div>
          <ol className="flex flex-wrap items-center gap-4">
            {rotation.crops.map((crop, index) => (
              <li key={crop} className="flex items-center gap-4">
                <div className="space-y-2">
                  <Badge variant="secondary">Step {index + 1}</Badge>
                  <p className="font-semibold">{crop}</p>
                </div>
                {index < rotation.crops.length - 1 && <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="strengths-title" className="space-y-4">
          <h2 id="strengths-title" className="text-title">Why use these crops?</h2>
          <ul className="max-w-prose space-y-3">
            {rotation.strengths.map((strength) => (
              <li key={strength} className="flex items-start gap-2">
                <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Alert variant="explanation" role="note">
        <TriangleAlert aria-hidden="true" />
        <AlertTitle>Trade-off to consider</AlertTitle>
        <AlertDescription>
          <p>{rotation.tradeoff}</p>
          <div className="mt-4 space-y-3" aria-label="Priority performance">
            <p className="font-medium text-foreground">How this rotation fits your priorities</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(rotation.priorityMetrics ?? []).map((metric) => (
                <div key={metric.label} className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
                  <span className="text-foreground">{metric.label}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-label={`${metric.label} fit`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metric.value}>
                    <div className={`h-full rounded-full ${metric.tone === "blue" ? "bg-chart-1" : metric.tone === "green" ? "bg-chart-2" : metric.tone === "pink" ? "bg-chart-3" : "bg-warning"}`} style={{ width: `${metric.value}%` }} />
                  </div>
                  <span className="text-right font-semibold tabular-nums text-foreground">{metric.value}%</span>
                </div>
              ))}
            </div>
            <p className="text-xs">Higher percentages indicate better alignment with the sampled farm conditions; they are screening indicators, not yield or income predictions.</p>
          </div>
          <p>Use these explanations as screening guidance and validate the choice with field observations, soil testing, and local agronomic advice.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}

