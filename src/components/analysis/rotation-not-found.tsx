"use client";

import Link from "next/link";
import { Sprout } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { useLanguage } from "@/components/language-provider";

export function RotationNotFound() {
  const { language } = useLanguage();
  const isFil = language === "fil";
  return (
    <>
      <Empty className="min-h-80">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Sprout aria-hidden="true" />
          </EmptyMedia>
          <h1 className="text-headline">{isFil ? "Hindi nakita ang rotation" : "Rotation not found"}</h1>
          <EmptyDescription>
            {isFil ? "Hindi available ang rotation na ito. Pumili ng opsyon mula sa paghahambing." : "This rotation is unavailable. Choose an option from the comparison."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/analysis" className={buttonVariants()}>
            {isFil ? "Bumalik sa paghahambing" : "Back to comparison"}
          </Link>
        </EmptyContent>
      </Empty>
    </>
  );
}
