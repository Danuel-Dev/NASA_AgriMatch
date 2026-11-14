"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { FarmPoint } from "@/lib/farm";

export type FarmMapProps = {
  point: FarmPoint | null;
  onChange?: (point: FarmPoint) => void;
};

const FarmMapCanvas = dynamic(() => import("./farm-map-canvas"), {
  ssr: false,
  loading: () => (
    <Skeleton
      className="h-full w-full"
      role="status"
      aria-label="Loading Albay map"
    />
  ),
});

export function FarmMap({ className, ...props }: FarmMapProps & { className?: string }) {
  return (
    <div className={cn("isolate z-0 h-70 overflow-hidden rounded-lg border lg:h-107.5", className)}>
      <FarmMapCanvas {...props} />
    </div>
  );
}
