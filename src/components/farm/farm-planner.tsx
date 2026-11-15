"use client";

import { ChevronRight } from "lucide-react";
import { FarmForm } from "./farm-form";
import { useLanguage } from "@/components/language-provider";

export function FarmPlanner() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="space-y-2">
          <h1 className="text-headline">{t("planner")}</h1>
          <p className="max-w-prose text-muted-foreground">
            {t("plannerDescription")}
          </p>
        </div>
        <ol aria-label="Planning steps" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {[t("location"), t("conditions"), t("comparison")].map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="size-4" aria-hidden="true" />}
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <FarmForm />
    </div>
  );
}

