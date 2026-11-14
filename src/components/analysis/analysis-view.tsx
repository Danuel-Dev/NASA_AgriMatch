import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ROTATIONS } from "@/lib/rotations";
import { FarmSnapshot } from "./farm-snapshot";
import { RotationOption } from "./rotation-option";

export function AnalysisView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-headline">Compare rotations</h1>
          <p className="max-w-prose text-muted-foreground">Explore crop sequences and the trade-offs behind each option.</p>
        </div>
        <Link href="/#farm-workspace" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeft aria-hidden="true" />Edit your farm
        </Link>
      </div>
      <Alert variant="warning" role="note" className="py-3">
        <Info aria-hidden="true" />
        <AlertTitle>Demo recommendations</AlertTitle>
        <AlertDescription>Scores and sequences are fixed examples, not calculated from your farm. Climate and soil datasets are not connected.</AlertDescription>
      </Alert>
      <FarmSnapshot />
      <section aria-labelledby="comparison-title" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="comparison-title" className="text-title">Rotation options</h2>
          <Badge variant="outline">3 demo options</Badge>
        </div>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {ROTATIONS.map((rotation) => <RotationOption key={rotation.id} rotation={rotation} />)}
        </div>
      </section>
      <p className="max-w-prose text-sm text-muted-foreground">Future analysis will explain how climate, soil, water access, and your priorities influence each option. These examples demonstrate the comparison only.</p>
    </div>
  );
}

