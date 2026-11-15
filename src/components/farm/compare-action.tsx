"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/components/language-provider";

export function CompareAction({ ready, submitting, help }: {
  ready: boolean;
  submitting: boolean;
  help: string;
}) {
  const spaceRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const action = actionRef.current;
    if (!action) return;
    const resize = new ResizeObserver(() => {
      spaceRef.current?.style.setProperty("--compare-action-height", `${action.getBoundingClientRect().height}px`);
    });
    resize.observe(action);
    return () => resize.disconnect();
  }, []);

  return (
    <div ref={spaceRef} className="compare-action-space">
      <div ref={actionRef} className="compare-action lg:border-t lg:pt-4">
        <div className="mx-auto max-w-xl space-y-2 lg:max-w-none">
          <Button type="submit" size="lg" disabled={!ready || submitting} aria-describedby="compare-help" className="w-full">
            {submitting ? <Spinner aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
            {submitting ? t("opening") : t("compare")}
          </Button>
          <p id="compare-help" role="status" aria-live="polite" className="text-sm text-muted-foreground">{help}</p>
        </div>
      </div>
    </div>
  );
}
