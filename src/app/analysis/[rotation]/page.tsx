import { notFound } from "next/navigation";
import { RotationDetail } from "@/components/analysis/rotation-detail";
import { ROTATIONS } from "@/lib/rotations";

export function generateStaticParams() {
  return ROTATIONS.map((rotation) => ({ rotation: rotation.id }));
}

export default async function RotationPage({
  params,
}: PageProps<"/analysis/[rotation]">) {
  const { rotation: id } = await params;
  const rotation = ROTATIONS.find((option) => option.id === id);
  if (!rotation) notFound();
  return <RotationDetail rotation={rotation} />;
}
