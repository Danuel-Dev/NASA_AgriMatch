import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Droplets, Leaf, Sprout, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Rotation } from "@/lib/rotations";
import { CROP_LABELS_FIL } from "@/lib/farm";
import { useLanguage } from "@/components/language-provider";

const cropCodes: Record<string, string> = { Rice: "1F33E", Corn: "1F33D", "Mung bean": "1FAD8", "Sweet potato": "1F360", Eggplant: "1F346", "Yardlong bean": "1FADB", Peanut: "1F95C" };

export function RotationOption({ rotation, recommended = false }: { rotation: Rotation; recommended?: boolean }) {
  const { language } = useLanguage();
  const isFil = language === "fil";
  const localizedCrops = rotation.crops.map((crop) => isFil ? (CROP_LABELS_FIL[crop] ?? crop) : crop);
  const localizedName = isFil ? `Opsyon sa rotation ${rotation.id.replace("option-", "")}` : rotation.id === "option-1" ? "Your current plan" : rotation.id === "option-2" ? "Alternative A" : "Alternative B";
  const eyebrow = isFil ? (rotation.id === "option-1" ? "Ang iyong napili" : rotation.id === "option-2" ? "Subukan ang ibang halo" : "Baguhin ang pagkakasunod") : rotation.id === "option-1" ? "What you selected" : rotation.id === "option-2" ? "Try a different mix" : "Change the order";
  const localizedSummary = isFil ? { "option-1": "Sinusuri ang napiling mga pananim batay sa mga kondisyon ng bukid.", "option-2": "Alternatibong pagkakasunod-sunod gamit ang klima, lupa, at kondisyon ng tubig.", "option-3": "Alternatibong pagkakasunod-sunod na sinusuri sa parehong kondisyon ng bukid." }[rotation.id] : rotation.summary;
  const localizedTradeoff = isFil ? { "option-1": "Ang pagpapatuloy sa kasalukuyang halo ay maaaring mag-iwan ng ilang panganib sa klima o tubig.", "option-2": "Ang ibang halo ng pananim ay maaaring mangailangan ng ibang pamamahala at tamang oras sa pamilihan.", "option-3": "Ang mga benepisyo sa kalusugan ng lupa ay pangmatagalan at hindi garantiya ng pagtaas ng ani." }[rotation.id] : rotation.tradeoff;
  const RotationIcon = rotation.id === "option-1" ? Droplets : rotation.id === "option-2" ? Sprout : Leaf;
  const metricValue = (metric: string) => rotation.priorityMetrics?.find((item) => item.label === metric)?.value ?? 0;
  const metricLabel = (metric: string) => isFil ? ({ "Water fit": "Angkop sa tubig", "Soil health": "Kalusugan ng lupa", "Climate fit": "Angkop sa klima" }[metric] ?? metric) : metric;
  const metricText = (metric: string) => {
    const value = metricValue(metric);
    if (isFil) return metric === "Water fit" ? (value >= 85 ? "Mas mababa" : "Nagbabago ayon sa pananim") : metric === "Soil health" ? (value >= 80 ? "May ambag ang legume" : "Batayan ng kasalukuyan") : value >= 80 ? "Nangangako" : "Batayan";
    return metric === "Water fit" ? (value >= 85 ? "Potentially lower" : "Varies by crop") : metric === "Soil health" ? (value >= 80 ? "Legume included" : "Current baseline") : value >= 80 ? "Promising to assess" : "Baseline";
  };
  return <article className={`relative flex h-full min-w-0 flex-col rounded-3xl border bg-card p-6 ${recommended ? "border-2 border-primary shadow-sm" : "border-border"}`}>
    {recommended && <Badge variant="success" className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">{isFil ? "Pinakamataas na demo score" : "Top demo score"}</Badge>}
    <div className="flex items-start gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-primary"><RotationIcon className="size-7" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="text-sm text-muted-foreground">{eyebrow}</p><h3 className="text-xl font-semibold">{localizedName}</h3></div></div>
    <div className="mt-7 space-y-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{isFil ? "Pagkakasunod ng pagtatanim" : "Planting sequence"}</p><div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-2">{localizedCrops.map((crop, index) => <span key={`${crop}-${index}`} className="contents"><span className="min-w-0 text-center"><span className="flex h-20 items-center justify-center rounded-2xl bg-accent"><CropIcon crop={rotation.crops[index]} /></span><span className="mt-3 block text-xs uppercase tracking-wide text-muted-foreground">{isFil ? "Hakbang" : "Step"} {index + 1}</span><span className="mt-1 block truncate text-sm font-semibold">{crop}</span></span>{index < 2 && <ArrowRight className="mt-9 size-4 shrink-0 text-primary" aria-hidden="true" />}</span>)}</div></div>
    <div className="mt-6 rounded-2xl bg-muted p-4"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{isFil ? "Demo score ng pagiging angkop" : "Sample match score"}</p><p className="mt-1 text-xs text-muted-foreground">{isFil ? "Mas mataas = mas malapit sa iyong layunin" : "Higher = closer to your chosen goal"}</p></div><p className="text-4xl font-bold tabular-nums text-primary">{rotation.score}<span className="text-sm font-medium text-muted-foreground">/100</span></p></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${rotation.score}%` }} /></div></div>
    <div className="mt-5 divide-y"><MetricRow icon={<Droplets />} label={metricLabel("Water fit")} value={metricText("Water fit")} /><MetricRow icon={<Sprout />} label={metricLabel("Soil health")} value={metricText("Soil health")} /><MetricRow icon={<span aria-hidden="true">☀️</span>} label={metricLabel("Climate fit")} value={metricText("Climate fit")} /></div>
    <div className="mt-5 space-y-3"><div className="flex items-center justify-between gap-2"><h4 className="font-semibold">⚖️ {isFil ? "Ano ang makukuha o isusuko?" : "What do I gain or give up?"}</h4><span className="text-xs text-muted-foreground">{isFil ? "Mga posibleng kapalit" : "Possible trade-offs"}</span></div><div className="rounded-2xl border border-success/20 bg-success-surface p-4"><p className="flex items-center gap-2 font-semibold"><Check className="size-4" aria-hidden="true" />{isFil ? "Posibleng bentahe" : "Potential advantage"}</p><p className="mt-2 text-sm text-muted-foreground">{localizedSummary}</p></div><div className="rounded-2xl border border-warning/30 bg-warning-surface p-4"><p className="flex items-center gap-2 font-semibold"><TriangleAlert className="size-4" aria-hidden="true" />{isFil ? "Isaalang-alang bago magpalit" : "Consider before switching"}</p><p className="mt-2 text-sm text-muted-foreground">{localizedTradeoff}</p></div></div>
    <Link href={`/analysis/${rotation.id}`} className={buttonVariants({ variant: "outline", className: "mt-5 w-full" })} aria-label={`${isFil ? "Tingnan ang mga kapalit para sa" : "View trade-offs for"} ${localizedName}`}>{isFil ? "Bakit isaalang-alang ang landas na ito?" : "Why consider this path?"}<ArrowRight aria-hidden="true" /></Link>
  </article>;
}

function CropIcon({ crop }: { crop: string }) { return <Image src={`https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg/${cropCodes[crop] ?? "1F331"}.svg`} alt="" aria-hidden="true" width={48} height={48} className="size-12 object-contain" unoptimized />; }
function MetricRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-center justify-between gap-3 py-3 text-sm"><span className="flex items-center gap-2 text-muted-foreground">{icon}<span>{label}</span></span><span className="text-right font-semibold">{value}</span></div>; }
