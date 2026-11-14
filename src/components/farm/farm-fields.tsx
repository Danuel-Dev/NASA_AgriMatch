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

  function toggleCrop(crop: string) {
    setFarm((current) => ({
      ...current,
      crops: toggleSelection(current.crops, crop),
    }));
  }

  return (
    <FieldGroup className="gap-4">
        <FieldSet className="gap-2">
          <FieldLegend variant="label" className="mb-0 font-semibold">Current crops</FieldLegend>
          <FieldDescription id="crops-help" className="sr-only">
            Choose the crops currently grown on this farm.
          </FieldDescription>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Current crops"
            aria-describedby="crops-help"
          >
            {CROP_OPTIONS.map((crop) => (
              <Field key={crop} orientation="horizontal" className="w-auto">
                <Checkbox
                  id={`crop-${crop.toLowerCase()}`}
                  checked={farm.crops.includes(crop)}
                  onCheckedChange={() => toggleCrop(crop)}
                />
                <FieldLabel
                  htmlFor={`crop-${crop.toLowerCase()}`}
                  className="min-h-11 cursor-pointer pr-3"
                >
                  {crop}
                </FieldLabel>
              </Field>
            ))}
          </div>
            {!farm.crops.length && (
              <FieldDescription>
                Select at least one crop to compare rotations.
              </FieldDescription>
            )}
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
          <FieldLabel htmlFor="soil">Soil texture</FieldLabel>
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
          <FieldLabel htmlFor="season">Season</FieldLabel>
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
