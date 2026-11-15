"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Sprout, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { useFarm } from "./farm-provider";
import { FarmPlanner } from "./farm-planner";

export function FarmExperience() {
  const [started, setStarted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { t, language } = useLanguage();
  const { setFarm } = useFarm();
  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).get("start") !== "1") return;
    window.history.replaceState({}, "", "/");
    const timer = window.setTimeout(() => {
      setFarm((farm) => ({ ...farm, currentRotation: [] }));
      setLoading(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [setFarm]);
  React.useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => {
      setLoading(false);
      setStarted(true);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [loading]);
  if (loading) return <PlannerLoadingScreen language={language} />;
  if (started) return <FarmPlanner />;
  return (
    <section className="grid min-h-[calc(100vh-11rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-7 py-8 lg:py-16">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" aria-hidden="true" />AgriMatch</div>
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{t("landingEyebrow")}</p>
          <h1 className="max-w-3xl text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-foreground">{t("landingTitle")}</h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">{t("landingDescription")}</p>
        </div>
        <Button size="lg" onClick={() => setLoading(true)}>
          {t("startPlanning")} <ArrowRight aria-hidden="true" />
        </Button>
        <p className="text-sm text-muted-foreground">{language === "fil" ? "Para sa mga magsasaka ng Albay · NASA Space Apps concept prototype" : "Made for Albay farmers · NASA Space Apps concept prototype"}</p>
      </div>
      <div className="relative min-h-80 overflow-hidden rounded-[2rem] border border-border bg-accent p-6 sm:min-h-[30rem] lg:rotate-[-3deg]">
        <Image src="/farm-landscape.svg" alt="Illustration of Albay farmland" fill className="object-cover" priority />
      </div>
    </section>
  );
}

function PlannerLoadingScreen({ language }: { language: "en" | "fil" }) {
  const isFilipino = language === "fil";
  return (
    <section className="fixed inset-0 z-50 grid place-items-center bg-background px-6" role="status" aria-live="polite" aria-label={isFilipino ? "Inihahanda ang tagaplano ng bukid" : "Preparing your farm planner"}>
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="relative grid size-48 place-items-center">
          <div className="absolute inset-5 rounded-[2rem] bg-accent" />
          <Sprout className="relative z-10 size-20 text-brand-mark" strokeWidth={1.5} aria-hidden="true" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary border-l-primary/40 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{isFilipino ? "Inihahanda ang iyong tagaplano" : "Preparing your farm planner"}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{isFilipino ? "Inihahanda ang mapa at mga tool sa pagpaplano ng pananim..." : "Setting up your map and crop-planning tools..."}</p>
        <div className="mt-12 h-3 w-full max-w-md overflow-hidden rounded-full bg-secondary" aria-hidden="true"><div className="h-full w-0 rounded-full bg-primary animate-farm-loading-progress motion-reduce:w-2/5 motion-reduce:animate-none" /></div>
      </div>
    </section>
  );
}
