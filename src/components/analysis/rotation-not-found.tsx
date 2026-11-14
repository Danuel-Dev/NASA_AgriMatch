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

export function RotationNotFound() {
  return (
    <>
      <Empty className="min-h-80">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Sprout aria-hidden="true" />
          </EmptyMedia>
          <h1 className="text-headline">Rotation not found</h1>
          <EmptyDescription>
            This rotation is unavailable. Choose an option from the comparison.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/analysis" className={buttonVariants()}>
            Back to comparison
          </Link>
        </EmptyContent>
      </Empty>
    </>
  );
}
