"use client";

import { useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isSupportedPoint } from "@/lib/farm";
import { useFarm } from "./farm-provider";
import { FarmFields } from "./farm-fields";
import { FarmLocation } from "./farm-location";
import { CompareAction } from "./compare-action";

export function FarmForm() {
  const { farm } = useFarm();
  const router = useRouter();
  const [submitting, startTransition] = useTransition();
  const ready =
    !!farm.point &&
    isSupportedPoint(farm.point) &&
    farm.crops.length > 0 &&
    farm.priorities.length > 0;

  function compareFarm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || submitting) return;
    startTransition(() => router.push("/analysis"));
  }

  const help = !farm.point
    ? "Choose a farm location to continue."
    : !farm.crops.length
      ? "Select at least one current crop to continue."
      : !farm.priorities.length
        ? "Choose at least one priority to continue."
        : "Ready to compare. Scores are fixed demo examples.";

  return (
    <div id="farm-workspace" className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_25rem]">
      <section aria-labelledby="farm-workspace-title" className="min-w-0 space-y-4">
        <div className="space-y-1">
          <h2 id="farm-workspace-title" className="text-title">Farm location</h2>
          <p className="text-sm text-muted-foreground">Search for a place or select your farm on the map.</p>
        </div>
        <FarmLocation />
      </section>
      <section aria-labelledby="farm-setup-title" className="min-w-0 space-y-4 border-t pt-6 lg:border-t-0 lg:pt-0">
        <div className="space-y-1">
          <h2 id="farm-setup-title" className="text-title">Farm conditions</h2>
          <p className="text-sm text-muted-foreground">Demo presets. Edit to match your farm.</p>
        </div>
        <form onSubmit={compareFarm} className="space-y-4">
          <FarmFields />
          <CompareAction ready={ready} submitting={submitting} help={help} />
        </form>
      </section>
    </div>
  );
}

