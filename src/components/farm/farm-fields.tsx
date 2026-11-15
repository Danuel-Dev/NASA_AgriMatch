"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle } from "lucide-react";
import {
  CROP_OPTIONS,
  IRRIGATION_OPTIONS,
  PRIORITY_OPTIONS,
  SEASON_OPTIONS,
  SOIL_OPTIONS,
  toggleSelection,
} from "@/lib/farm";
import { useFarm } from "./farm-provider";

export function FarmFields() {
  const { farm, setFarm } = useFarm();

  return (
    <FieldGroup className="gap-4">
        <FieldSet className="gap-2">
          <FieldLegend variant="label" className="mb-0 font-semibold">Current rotation</FieldLegend>
          <FieldDescription>Choose the crop sequence you currently use across three growing periods.</FieldDescription>
          <div className="grid gap-3 sm:grid-cols-3">
            {farm.currentRotation.map((crop, index) => (
              <Field key={`rotation-${index}`}>
                <FieldLabel htmlFor={`rotation-${index}`}>Growing period {index + 1}</FieldLabel>
                <Select
                  name={`rotation-${index}`}
                  value={crop}
                  items={CROP_OPTIONS.map((value) => ({ value, label: value }))}
                  onValueChange={(value) => {
                    if (value !== null) setFarm((current) => ({
                      ...current,
                      currentRotation: current.currentRotation.map((item, itemIndex) => itemIndex === index ? value : item),
                    }));
                  }}
                >
                  <SelectTrigger id={`rotation-${index}`}><SelectValue /></SelectTrigger>
                  <SelectContent><SelectGroup>{CROP_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectGroup></SelectContent>
                </Select>
              </Field>
            ))}
          </div>
        </FieldSet>
        <FieldSet className="gap-2">
          <FieldLegend variant="label" className="mb-0 font-semibold">Irrigation</FieldLegend>
          <FieldDescription id="irrigation-help" className="sr-only">
            How much water is available to your farm?
          </FieldDescription>
          <RadioGroup
            value={farm.irrigation}
            onValueChange={(value) =>
              setFarm((current) => ({ ...current, irrigation: value }))
            }
            aria-label="Irrigation"
            aria-describedby="irrigation-help"
            className="flex flex-wrap gap-x-6"
          >
            {IRRIGATION_OPTIONS.map((option) => (
              <Field key={option} orientation="horizontal" className="w-auto">
                <RadioGroupItem
                  id={`irrigation-${option.toLowerCase()}`}
                  value={option}
                />
                <FieldLabel
                  htmlFor={`irrigation-${option.toLowerCase()}`}
                  className="min-h-12 cursor-pointer pr-3"
                >
                  {option}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
      <div className="grid gap-4 @sm/field-group:grid-cols-2">
        <Field>
          <div className="flex items-center gap-1">
            <FieldLabel htmlFor="soil">Soil texture</FieldLabel>
            <FieldHelp label="Soil texture help">
              Use the texture from your farm records or soil assessment. If unsure, ask your local agricultural office before relying on a recommendation.
            </FieldHelp>
          </div>
          <Select
            name="soil"
            value={farm.soil}
            items={SOIL_OPTIONS.map((value) => ({ value, label: value }))}
            onValueChange={(value) => {
              if (value !== null)
                setFarm((current) => ({ ...current, soil: value }));
            }}
          >
            <SelectTrigger id="soil">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SOIL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <div className="flex items-center gap-1">
            <FieldLabel htmlFor="season">Season</FieldLabel>
            <FieldHelp label="Season help">
              Choose the growing period you are planning for. The app uses this selection to screen seasonal rainfall and temperature fit.
            </FieldHelp>
          </div>
          <Select
            name="season"
            value={farm.season}
            items={SEASON_OPTIONS.map((value) => ({ value, label: value }))}
            onValueChange={(value) => {
              if (value !== null)
                setFarm((current) => ({ ...current, season: value }));
            }}
          >
            <SelectTrigger id="season">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SEASON_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <FieldSet className="gap-2">
        <FieldLegend variant="label" className="mb-0 font-semibold">What matters most?</FieldLegend>
        <FieldDescription id="priorities-help" className="sr-only">
          Choose one or more priorities.
        </FieldDescription>
        <div
          className="flex flex-wrap gap-x-4 gap-y-1"
          role="group"
          aria-label="Farm priorities"
          aria-describedby="priorities-help"
        >
          {PRIORITY_OPTIONS.map((priority, index) => (
            <Field key={priority} orientation="horizontal" className="w-auto">
              <Checkbox
                id={`priority-${index}`}
                checked={farm.priorities.includes(priority)}
                onCheckedChange={() =>
                  setFarm((current) => ({
                    ...current,
                    priorities: toggleSelection(current.priorities, priority),
                  }))
                }
              />
              <FieldLabel
                htmlFor={`priority-${index}`}
                className="min-h-11 cursor-pointer"
              >
                {priority}
              </FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>
      <Accordion>
        <AccordionItem value="conditions-help">
          <AccordionTrigger className="min-h-11 items-center">Help with soil and season</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="font-medium text-foreground">Soil texture:</strong> use the value from your farm records or soil assessment. If you are unsure, ask your local agricultural office before relying on a recommendation.</p>
              <p><strong className="font-medium text-foreground">Season:</strong> choose the season you are planning for. These are editable examples; the app has not detected your soil or season.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </FieldGroup>
  );
}

function FieldHelp({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex" tabIndex={0} aria-label={label}>
      <HelpCircle className="size-4 text-muted-foreground" aria-hidden="true" />
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border bg-popover p-3 text-xs font-normal text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {children}
      </span>
    </span>
  );
}
