"use client";

import { useState } from "react";
import Image from "next/image";

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
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";
import {
  CROP_OPTIONS,
  CROP_LABELS_FIL,
  IRRIGATION_OPTIONS,
  IRRIGATION_LABELS_FIL,
  PRIORITY_OPTIONS,
  PRIORITY_LABELS_FIL,
  SEASON_OPTIONS,
  SEASON_LABELS_FIL,
  SOIL_OPTIONS,
  SOIL_LABELS_FIL,
  toggleSelection,
} from "@/lib/farm";
import { useFarm } from "./farm-provider";
import { useLanguage } from "@/components/language-provider";

export function FarmFields() {
  const { farm, setFarm } = useFarm();
  const { t, language } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [cropPickerOpen, setCropPickerOpen] = useState(true);

  return (
    <FieldGroup className="gap-4">
        <FieldSet className="gap-2">
          <FieldLegend variant="label" className="mb-0 font-semibold">{t("currentRotation")}</FieldLegend>
          <FieldDescription>{t("rotationHelp")}</FieldDescription>
          <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label={t("currentRotation")}>
            {farm.currentRotation.map((crop, index) => (
              <Button key={`period-${index}`} type="button" variant="ghost" role="tab" aria-selected={selectedPeriod === index} onClick={() => { setSelectedPeriod(index); setCropPickerOpen(true); }} className={`min-h-12 justify-start border ${selectedPeriod === index ? "border-primary bg-accent text-primary" : "border-border bg-card text-foreground hover:border-primary hover:bg-accent"}`}>
                <span className={`grid size-7 place-items-center rounded-md ${selectedPeriod === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index + 1}</span>
                {t("growingPeriod")} {index + 1}: <span className="font-normal">{language === "fil" ? CROP_LABELS_FIL[crop] : crop}</span>
              </Button>
            ))}
          </div>
          {cropPickerOpen && <>
            <div role="tabpanel" aria-label={`${t("growingPeriod")} ${selectedPeriod + 1}`} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CROP_OPTIONS.map((option, index) => {
                const selected = farm.currentRotation[selectedPeriod] === option;
                return <Button key={option} type="button" variant="ghost" aria-pressed={selected} onClick={() => setFarm((current) => ({ ...current, currentRotation: current.currentRotation.map((item, itemIndex) => itemIndex === selectedPeriod ? option : item) }))} className={`h-28 flex-col gap-2 rounded-xl border px-2 text-center ${index === CROP_OPTIONS.length - 1 ? "sm:col-start-2" : ""} ${selected ? "border-2 border-primary bg-accent text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:bg-accent"}`}>
                  <CropIcon crop={option} large />
                  <span className="font-semibold">{language === "fil" ? CROP_LABELS_FIL[option] : option}</span>
                </Button>;
              })}
            </div>
            <div className="flex justify-end"><Button type="button" variant="outline" onClick={() => setCropPickerOpen(false)}><Check aria-hidden="true" />{language === "fil" ? "Tapos na" : "Done"}</Button></div>
          </>}
        </FieldSet>
        <FieldSet className="gap-2">
          <FieldLegend variant="label" className="mb-0 font-semibold">{t("irrigation")}</FieldLegend>
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
                    <span className="flex items-center gap-2"><IrrigationIcon option={option} />{language === "fil" ? IRRIGATION_LABELS_FIL[option] : option}</span>
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
      <div className="grid gap-4 @sm/field-group:grid-cols-2">
        <Field>
          <div className="flex items-center gap-1">
            <FieldLabel htmlFor="soil">{t("soilTexture")}</FieldLabel>
            <FieldHelp label={language === "fil" ? "Tulong sa tekstura ng lupa" : "Soil texture help"}>{t("soilHelp")}</FieldHelp>
          </div>
          <Select
            name="soil"
            value={farm.soil}
            items={SOIL_OPTIONS.map((value) => ({ value, label: language === "fil" ? SOIL_LABELS_FIL[value] : value }))}
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
                    {language === "fil" ? SOIL_LABELS_FIL[option] : option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <div className="flex items-center gap-1">
            <FieldLabel htmlFor="season">{t("season")}</FieldLabel>
            <FieldHelp label={language === "fil" ? "Tulong sa panahon" : "Season help"}>{t("seasonHelp")}</FieldHelp>
          </div>
          <Select
            name="season"
            value={farm.season}
            items={SEASON_OPTIONS.map((value) => ({ value, label: language === "fil" ? SEASON_LABELS_FIL[value] : value }))}
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
                    {language === "fil" ? SEASON_LABELS_FIL[option] : option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <FieldSet className="gap-2">
        <FieldLegend variant="label" className="mb-0 font-semibold">{t("priorities")}</FieldLegend>
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
                <span className="flex items-center gap-2"><PriorityIcon priority={priority} />{language === "fil" ? PRIORITY_LABELS_FIL[priority] : priority}</span>
              </FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>
      <Accordion>
        <AccordionItem value="conditions-help">
          <AccordionTrigger className="min-h-11 items-center">{language === "fil" ? "Tulong sa lupa at panahon" : "Help with soil and season"}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="font-medium text-foreground">{t("soilTexture")}:</strong> {t("soilHelp")}</p>
              <p><strong className="font-medium text-foreground">{t("season")}:</strong> {t("seasonHelp")}</p>
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

function CropIcon({ crop, large = false }: { crop: string; large?: boolean }) {
  const codes: Record<string, string> = { Rice: "1F33E", Corn: "1F33D", "Mung bean": "1FAD8", "Sweet potato": "1F360", Eggplant: "1F346", "Yardlong bean": "1FADB", Peanut: "1F95C" };
  return <Image src={`https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg/${codes[crop] ?? "1F331"}.svg`} alt="" aria-hidden="true" width={large ? 40 : 20} height={large ? 40 : 20} className={`${large ? "size-10" : "size-5"} shrink-0 object-contain`} unoptimized />;
}

function IrrigationIcon({ option }: { option: string }) {
  return <OpenMojiIcon code={option === "Adequate" ? "1F4A7" : "2600"} />;
}

function PriorityIcon({ priority }: { priority: string }) {
  const code = priority === "Conserve water" ? "1F4A7" : priority === "Improve soil health" ? "1F331" : priority === "Climate suitability" ? "2600" : priority === "Reduce heat stress" ? "1F321" : priority === "Support crop diversity" ? "1F343" : "267B";
  return <OpenMojiIcon code={code} />;
}

function OpenMojiIcon({ code }: { code: string }) {
  return <Image src={`https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg/${code}.svg`} alt="" aria-hidden="true" width={20} height={20} className="size-5 shrink-0 object-contain" unoptimized />;
}
