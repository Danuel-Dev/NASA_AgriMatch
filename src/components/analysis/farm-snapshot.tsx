"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FarmMap } from "@/components/farm/farm-map";
import { useFarm } from "@/components/farm/farm-provider";
import { formatCoordinates } from "@/lib/farm";

export function FarmSnapshot() {
  const { farm } = useFarm();

  return (
    <section aria-label="Your farm snapshot" className="border-y py-4">
      {farm.point ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div className="min-w-0 space-y-1">
              <h2 className="text-base font-semibold">Selected farm</h2>
              <p className="wrap-anywhere text-sm">{farm.locationName}</p>
            </div>
            <p className="wrap-anywhere font-mono text-sm tabular-nums text-muted-foreground">{formatCoordinates(farm.point)}</p>
          </div>
          <Accordion>
            <AccordionItem value="farm-details">
              <AccordionTrigger className="min-h-11 items-center">Farm conditions and priorities</AccordionTrigger>
              <AccordionContent>
                <div className="grid items-start gap-5 pt-2 lg:grid-cols-3 lg:gap-8">
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold">Farm conditions</h3>
                    <dl className="space-y-2 text-sm">
                      {[["Soil texture", farm.soil], ["Irrigation", farm.irrigation], ["Season", farm.season]].map(([label, value]) => (
                        <div key={label} className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                          <dt className="text-muted-foreground">{label}</dt>
                          <dd className="font-medium">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold">Current crops</h3>
                      <div className="flex flex-wrap gap-2" aria-label="Selected crops">
                        {farm.crops.map((crop) => <Badge key={crop} variant="crop">{crop}</Badge>)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold">Your priorities</h3>
                      <div className="flex flex-wrap gap-2">
                        {farm.priorities.map((priority) => <Badge key={priority} variant="secondary">{priority}</Badge>)}
                      </div>
                    </div>
                  </div>
                  <Accordion>
                    <AccordionItem value="farm-map">
                      <AccordionTrigger className="min-h-11 items-center">View farm map</AccordionTrigger>
                      <AccordionContent><FarmMap point={farm.point} className="h-56 lg:h-56" /></AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ) : (
        <Empty className="items-start gap-3 p-0 text-left md:p-0">
          <EmptyHeader className="max-w-none flex-row items-start gap-3 text-left">
            <EmptyMedia variant="icon"><MapPin aria-hidden="true" /></EmptyMedia>
            <div className="space-y-1">
              <EmptyTitle>No farm selected</EmptyTitle>
              <EmptyDescription>These are sample rotations. Choose a farm to add your location and preferences.</EmptyDescription>
            </div>
          </EmptyHeader>
          <EmptyContent className="max-w-none items-start">
            <Link href="/#farm-workspace" className={buttonVariants({ variant: "outline" })}>Choose a farm</Link>
          </EmptyContent>
        </Empty>
      )}
    </section>
  );
}

