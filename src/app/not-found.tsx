import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <>
      <Empty className="min-h-80">
        <EmptyHeader>
          <h1 className="text-headline">Page not found</h1>
          <EmptyDescription>
            This page is unavailable. Return to your farm to continue.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants()}>
            Back to your farm
          </Link>
        </EmptyContent>
      </Empty>
    </>
  );
}
