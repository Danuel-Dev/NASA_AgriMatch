"use client";

import { useRef } from "react";
import Link from "next/link";
import { Sparkle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-(--page-width) flex-col">
      <Link
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
        className={buttonVariants({
          className:
            "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50",
        })}
      >
        Skip to content
      </Link>
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b py-2">
        <Link
          href="/"
          aria-label="AgriMatch home"
          className="inline-flex min-h-11 max-w-full items-center gap-3 rounded-lg text-(length:--font-size-brand) font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Sparkle
            className="size-7 fill-brand-mark text-brand-mark"
            aria-hidden="true"
          />
          <span>
            Agri<span className="text-primary">Match</span>
          </span>
        </Link>
        <Badge variant="outline">Albay pilot · Demo</Badge>
      </header>
      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 py-6 sm:py-8"
      >
        {children}
      </main>
      <footer className="mt-6 flex flex-col gap-2 border-t py-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span>AgriMatch</span>
        <span>Built for climate-resilient farming in Albay</span>
      </footer>
      </div>
    </div>
  );
}
