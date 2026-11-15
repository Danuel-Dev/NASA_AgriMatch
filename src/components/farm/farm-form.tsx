"use client";

import { useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isSupportedPoint } from "@/lib/farm";
import { useFarm } from "./farm-provider";
import { FarmFields } from "./farm-fields";
import { FarmLocation } from "./farm-location";
import { CompareAction } from "./compare-action";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function FarmForm({ step, onStepChange }: { step: 1 | 2; onStepChange: (step: 1 | 2) => void }) {
  const { farm } = useFarm();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [submitting, startTransition] = useTransition();
  const ready =
    !!farm.point &&
    isSupportedPoint(farm.point) &&
    farm.currentRotation.length === 3 &&
    farm.priorities.length > 0;

  function compareFarm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || submitting) return;
    startTransition(() => router.push("/analysis"));
  }

  const help = !farm.point
    ? t("chooseLocation")
    : farm.currentRotation.length !== 3
      ? (language === "fil" ? "Pumili ng pananim para sa bawat panahon upang magpatuloy." : "Choose a crop for each growing period to continue.")
      : !farm.priorities.length
      ? t("choosePriority")
      : t("ready");

  return (
    <div id="farm-workspace" className="space-y-6">
      {step === 1 ? <section aria-labelledby="farm-workspace-title" className="min-w-0 space-y-4">
        <div className="rounded-xl border border-primary/30 bg-accent/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{language === "fil" ? "Hakbang 1 · Simulan dito" : "Step 1 · Start here"}</p>
          <h2 id="farm-workspace-title" className="mt-1 text-title">{t("farmLocation")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("locationHelp")}</p>
        </div>
        <FarmLocation />
        <div className="flex justify-end border-t pt-4"><Button type="button" size="lg" disabled={!farm.point || !isSupportedPoint(farm.point)} onClick={() => onStepChange(2)}>{language === "fil" ? "Magpatuloy sa detalye ng bukid" : "Continue to farm details"} <ArrowRight aria-hidden="true" /></Button></div>
      </section> : <section aria-labelledby="farm-setup-title" className="min-w-0 space-y-4">
        <div className="rounded-xl border border-primary/30 bg-accent/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{language === "fil" ? "Hakbang 2 · Sabihin sa amin" : "Step 2 · Tell us about your farm"}</p>
          <h2 id="farm-setup-title" className="mt-1 text-title">{t("farmConditions")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("demoPresets")}</p>
        </div>
        <form onSubmit={compareFarm} className="space-y-4">
          <FarmFields />
          <div className="flex flex-wrap items-center justify-between gap-3"><Button type="button" variant="outline" onClick={() => onStepChange(1)}><ArrowLeft aria-hidden="true" />{language === "fil" ? "Bumalik sa lokasyon" : "Back to location"}</Button><div className="min-w-0 flex-1"><CompareAction ready={ready} submitting={submitting} help={help} /></div></div>
        </form>
      </section>}
      {/* The two sections above are intentionally sequential; the existing analysis route remains the third step. */}
    </div>
  );
}

