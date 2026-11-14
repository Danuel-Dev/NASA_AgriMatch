import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Rotation } from "@/lib/rotations";

export function RotationDetail({ rotation }: { rotation: Rotation }) {
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
            <span>/100 demo fit score</span>
          </Badge>
        </div>
      </div>
      <Alert variant="warning" role="note" className="py-3">
        <Info aria-hidden="true" />
        <AlertTitle>Placeholder analysis</AlertTitle>
        <AlertDescription>This sequence and score are illustrative, not calculated from your farm or environmental datasets.</AlertDescription>
      </Alert>
      <div className="grid gap-6 border-t pt-6 lg:grid-cols-2 lg:gap-12">
        <section aria-labelledby="sequence-title" className="space-y-4">
          <div className="space-y-1">
            <h2 id="sequence-title" className="text-title">Crop sequence</h2>
            <p className="text-sm text-muted-foreground">The order of crops in this demo rotation.</p>
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
          <h2 id="strengths-title" className="text-title">Why it may work</h2>
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
          <p>This example needs validation against actual farm, climate, soil, and water data.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}

