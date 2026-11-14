"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-headline">This view could not load</h1>
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            Your farm selections are still available in this session. Try
            loading the view again.
          </AlertDescription>
        </Alert>
        <Button type="button" onClick={retry}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
      </div>
    </>
  );
}
