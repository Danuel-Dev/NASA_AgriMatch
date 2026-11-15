import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Rotation } from "@/lib/rotations";

export function RotationOption({ rotation, recommended = false }: { rotation: Rotation; recommended?: boolean }) {
  return (
    <article className={`flex h-full min-w-0 flex-col gap-4 rounded-lg border p-4 ${recommended ? "border-2 border-primary bg-accent/50 shadow-md" : "border-transparent"}`}>
      <Separator />
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant={`rotation-${rotation.tone}`}>
            <Sprout aria-hidden="true" />
            {rotation.id.replace("option-", "Option ")}
          </Badge>
          {recommended && <Badge variant="success">Highest screening score</Badge>}
        </div>
        <h3 className="text-xl font-semibold">{rotation.name}</h3>
        <p className="text-sm text-muted-foreground">
          {rotation.crops.join(" → ")}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">
            {rotation.score}
          </span>
          <span className="text-sm text-muted-foreground">
            /100 screening fit score
          </span>
        </p>
        <p className="text-sm text-muted-foreground">{rotation.summary}</p>
        <p className="text-sm"><span className="font-medium">Trade-off: </span>{rotation.tradeoff}</p>
      </div>
      <div>
        <Link
          href={`/analysis/${rotation.id}`}
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
          aria-label={`View trade-offs for ${rotation.name}`}
        >
          View trade-offs
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
