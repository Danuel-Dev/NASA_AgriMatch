"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { FarmPlanner } from "./farm-planner";

export function FarmExperience() {
  const [started, setStarted] = React.useState(false);
  const { t } = useLanguage();
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
        <Button size="lg" onClick={() => setStarted(true)}>
          {t("startPlanning")} <ArrowRight aria-hidden="true" />
        </Button>
        <p className="text-sm text-muted-foreground">Made for Albay farmers · NASA Space Apps concept prototype</p>
      </div>
      <div className="relative min-h-80 overflow-hidden rounded-[2rem] border border-border bg-accent p-6 sm:min-h-[30rem] lg:rotate-[-3deg]">
        <Image src="/farm-landscape.svg" alt="Illustration of Albay farmland" fill className="object-cover" priority />
      </div>
    </section>
  );
}
