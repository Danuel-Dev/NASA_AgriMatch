import Link from "next/link";
import { ArrowRight, Droplets, Leaf, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Rotation } from "@/lib/rotations";
import { useLanguage } from "@/components/language-provider";
import { CROP_LABELS_FIL } from "@/lib/farm";

export function RotationOption({ rotation, recommended = false }: { rotation: Rotation; recommended?: boolean }) {
  const { t, language } = useLanguage();
  const localizedName = language === "fil" ? `Opsyon sa rotation ${rotation.id.replace("option-", "")}` : rotation.name;
  const localizedCrops = rotation.crops.map((crop) => language === "fil" ? (CROP_LABELS_FIL[crop] ?? crop) : crop).join(" → ");
  const localizedSummary = language === "fil" ? {
    "option-1": "Sinusuri ang napiling mga pananim batay sa mga kondisyon ng bukid.",
    "option-2": "Alternatibong pagkakasunod-sunod gamit ang klima, lupa, at kondisyon ng tubig.",
    "option-3": "Alternatibong pagkakasunod-sunod na sinusuri sa parehong kondisyon ng bukid.",
  }[rotation.id] : rotation.summary;
  const localizedTradeoff = language === "fil" ? {
    "option-1": "Ang pagpapatuloy sa kasalukuyang halo ay maaaring mag-iwan ng ilang panganib sa klima o tubig.",
    "option-2": "Ang ibang halo ng pananim ay maaaring mangailangan ng ibang pamamahala at tamang oras sa pamilihan.",
    "option-3": "Ang mga benepisyo sa kalusugan ng lupa ay pangmatagalan at hindi garantiya ng pagtaas ng ani.",
  }[rotation.id] : rotation.tradeoff;
  const RotationIcon = rotation.id === "option-1" ? Droplets : rotation.id === "option-2" ? Sprout : Leaf;
  return (
    <article className={`flex h-full min-w-0 flex-col gap-4 rounded-lg border p-4 ${recommended ? "border-2 border-primary bg-accent/50 shadow-md" : "border-transparent"}`}>
      <Separator />
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant={`rotation-${rotation.tone}`}>
            <RotationIcon aria-hidden="true" />
            {language === "fil" ? `Opsyon ${rotation.id.replace("option-", "")}` : rotation.id.replace("option-", "Option ")}
          </Badge>
          {recommended && <Badge variant="success">{t("highest")}</Badge>}
        </div>
        <h3 className="text-xl font-semibold">{localizedName}</h3>
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
          <RotationIcon className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{localizedCrops}</p>
        </div>
        <p className="hidden text-sm text-muted-foreground">
          {rotation.crops.join(" → ")}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">
            {rotation.score}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("score")}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">{localizedSummary}</p>
        <p className="hidden text-sm text-muted-foreground">{rotation.summary}</p>
        <p className="text-sm"><span className="font-medium">{t("tradeoff")} </span>{localizedTradeoff}</p>
        <p className="hidden text-sm"><span className="font-medium">{t("tradeoff")} </span>{rotation.tradeoff}</p>
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
          {t("viewTradeoffs")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
