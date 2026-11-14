import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div
        role="status"
        aria-label="Loading farm comparison"
        className="space-y-6"
      >
        <Skeleton className="h-10 w-3/4 max-w-sm" />
        <Skeleton className="h-6 w-full max-w-xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
