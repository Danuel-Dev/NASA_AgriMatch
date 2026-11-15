"use client";

import { useRef } from "react";
import Link from "next/link";
import { Sparkle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const { language, setLanguage, t } = useLanguage();
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
        {t("skip")}
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
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center rounded-lg border border-input bg-card p-0.5" aria-label="Language">
            <Button type="button" size="sm" variant={language === "en" ? "secondary" : "ghost"} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>English</Button>
            <Button type="button" size="sm" variant={language === "fil" ? "secondary" : "ghost"} onClick={() => setLanguage("fil")} aria-pressed={language === "fil"}>Filipino</Button>
          </div>
          <Badge variant="outline">{t("pilot")}</Badge>
        </div>
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
        <span>{t("footer")}</span>
      </footer>
      </div>
    </div>
  );
}
