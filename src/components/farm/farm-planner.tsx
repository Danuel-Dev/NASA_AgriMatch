"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FarmForm } from "./farm-form";
import { useLanguage } from "@/components/language-provider";

export function FarmPlanner() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const stepLabels = language === "fil"
    ? ["Hanapin ang bukid", "Detalye ng bukid", "Ihambing ang mga opsyon"]
    : ["Locate farm", "Farm details", "Compare options"];
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="space-y-2">
          <h1 className="text-headline">{t("planner")}</h1>
          <p className="max-w-prose text-muted-foreground">
            {t("plannerDescription")}
          </p>
        </div>
        <ol aria-label={language === "fil" ? "Mga hakbang sa pagpaplano" : "Planning steps"} className="grid w-full gap-3 text-sm sm:grid-cols-3 lg:max-w-3xl">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const completed = stepNumber < step;
            const active = stepNumber === step;
            const disabled = stepNumber === 3;
            return <li key={label}>
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                onClick={() => { if (stepNumber === 1 || stepNumber === 2) setStep(stepNumber); }}
                className={`min-h-20 w-full justify-start gap-4 rounded-2xl border px-4 text-left ${active ? "border-primary bg-accent text-primary" : completed ? "border-border bg-card text-primary" : "border-border bg-card text-muted-foreground"} ${disabled ? "cursor-default opacity-100" : ""}`}
                aria-current={active ? "step" : undefined}
              >
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl text-base font-semibold ${completed || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {completed ? <Check aria-hidden="true" /> : stepNumber}
                </span>
                <span className="font-semibold">{label}</span>
              </Button>
            </li>;
          })}
        </ol>
      </div>
      <FarmForm step={step} onStepChange={setStep} />
    </div>
  );
}

