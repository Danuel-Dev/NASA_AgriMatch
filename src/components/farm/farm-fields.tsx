"use client";

import Image from "next/image";

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
import { ArrowRight, HelpCircle } from "lucide-react";
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
  const selectedCrops = farm.currentRotation.filter((crop, index, crops) => crops.indexOf(crop) === index);

  function chooseCrop(option: string) {
    setFarm((current) => {
      const rotation = current.currentRotation.filter((crop, index, crops) => crops.indexOf(crop) === index);
      const selectedIndex = rotation.indexOf(option);
      if (selectedIndex >= 0) return { ...current, currentRotation: rotation.filter((crop) => crop !== option) };
      if (rotation.length >= 3) return current;
      return { ...current, currentRotation: [...rotation, option] };
    });
  }

  return (
    <FieldGroup className="gap-4">
        <FieldSet className="gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <FieldLegend variant="label" className="mb-0 font-semibold">{language === "fil" ? "Pumili ng 3 pananim para sa kasalukuyang rotation" : "Choose 3 crops for your current rotation"}</FieldLegend>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">{selectedCrops.length} {language === "fil" ? "sa 3 napili" : "of 3 selected"}</span>
          </div>
          <FieldDescription>{language === "fil" ? "I-tap ang mga pananim ayon sa karaniwang pagkakasunod ng pagtatanim. I-tap muli ang napili upang alisin ito." : "Tap crops in the order you normally plant them. Tap a selected crop to remove it."}</FieldDescription>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="group" aria-label={t("currentRotation")}>
            {CROP_OPTIONS.map((option, index) => {
              const order = selectedCrops.indexOf(option);
              const selected = order >= 0;
              return <Button key={option} type="button" variant="ghost" aria-pressed={selected} onClick={() => chooseCrop(option)} className={`relative h-28 flex-col gap-2 rounded-xl border px-2 text-center ${index === CROP_OPTIONS.length - 1 ? "sm:col-start-2" : ""} ${selected ? "border-2 border-primary bg-accent text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:bg-accent"}`}>
                {selected && <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{order + 1}</span>}
                <CropIcon crop={option} large />
                <span className="font-semibold">{language === "fil" ? CROP_LABELS_FIL[option] : option}</span>
              </Button>;
            })}
          </div>
          <div className="rounded-2xl border border-border bg-muted/60 p-4">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{language === "fil" ? "Iyong 3-pananim na pagkakasunod" : "Your 3-crop planting order"}</p>
            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
              {[0, 1, 2].map((index) => {
                const crop = selectedCrops[index];
                return <span key={`order-${index}`} className="contents">
                  <span className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-primary/40 bg-card p-3 text-center">
                    {crop ? <><CropIcon crop={crop} large /><span className="mt-2 text-xs text-muted-foreground">{language === "fil" ? `Pananim ${index + 1}` : `Crop ${index + 1}`}</span><span className="font-semibold">{language === "fil" ? CROP_LABELS_FIL[crop] : crop}</span></> : <><span className="text-2xl text-muted-foreground">—</span><span className="mt-2 text-xs text-muted-foreground">{language === "fil" ? `Pananim ${index + 1}` : `Crop ${index + 1}`}</span><span className="text-sm text-muted-foreground">{language === "fil" ? "Pumili" : "Choose"}</span></>}
                  </span>
                  {index < 2 && <ArrowRight className="mx-auto hidden size-5 text-primary sm:block" aria-hidden="true" />}
                </span>;
              })}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{selectedCrops.length === 3 ? (language === "fil" ? "✓ Handa na ang iyong three-crop rotation!" : "✓ Your three-crop rotation is ready!") : (language === "fil" ? `Pumili pa ng ${3 - selectedCrops.length} pananim.` : `Choose ${3 - selectedCrops.length} more crop${3 - selectedCrops.length === 1 ? "" : "s"}.`)}</p>
          </div>
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
            aria-label={language === "fil" ? "Patubig" : "Irrigation"}
            aria-describedby="irrigation-help"
            className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap"
          >
            {IRRIGATION_OPTIONS.map((option) => (
              <Field key={option} orientation="horizontal" className={`w-full rounded-xl border px-3 transition-colors sm:w-auto ${farm.irrigation === option ? "border-primary bg-accent text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:bg-accent"}`}>
                <RadioGroupItem
                  id={`irrigation-${option.toLowerCase()}`}
                  value={option}
                  className="sr-only"
                />
                <FieldLabel
                  htmlFor={`irrigation-${option.toLowerCase()}`}
                  className="min-h-12 w-full cursor-pointer justify-center px-0 text-base font-semibold sm:min-w-24"
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
        <FieldDescription id="priorities-help" className="text-sm text-muted-foreground">
          {language === "fil" ? "Pumili ng isa o higit pang prayoridad para sa paghahambing." : "Choose one or more priorities for the comparison."}
        </FieldDescription>
        <div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          role="group"
          aria-label={language === "fil" ? "Mga prayoridad ng bukid" : "Farm priorities"}
          aria-describedby="priorities-help"
        >
          {PRIORITY_OPTIONS.map((priority, index) => (
            <Field key={priority} orientation="horizontal" className={`min-h-16 rounded-xl border px-4 transition-colors ${farm.priorities.includes(priority) ? "border-2 border-primary bg-accent text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:bg-accent"}`}>
              <Checkbox
                id={`priority-${index}`}
                checked={farm.priorities.includes(priority)}
                className="sr-only"
                onCheckedChange={() =>
                  setFarm((current) => ({
                    ...current,
                    priorities: toggleSelection(current.priorities, priority),
                  }))
                }
              />
              <FieldLabel
                htmlFor={`priority-${index}`}
                className="min-h-16 w-full cursor-pointer px-0 text-base font-semibold"
              >
                <span className="flex items-center gap-2"><PriorityIcon priority={priority} />{language === "fil" ? PRIORITY_LABELS_FIL[priority] : priority}</span>
              </FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>
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
