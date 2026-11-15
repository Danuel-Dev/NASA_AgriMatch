"use client";

import { useRef, useState, type FormEvent } from "react";
import { Search, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { searchLocations, type LocationResult } from "@/lib/location-search";
import type { FarmPoint } from "@/lib/farm";
import { useLanguage } from "@/components/language-provider";

export function LocationSearch({ onSelect }: { onSelect: (point: FarmPoint, name: string) => void }) {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || searching) return;
    requestRef.current?.abort();
    const request = new AbortController();
    requestRef.current = request;
    setSearching(true); setError(""); setResults([]);
    try {
      const matches = await searchLocations(trimmed, request.signal);
      if (request.signal.aborted) return;
      setResults(matches);
    } catch (cause) {
      if (request.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : "Location search failed. Try again.");
    } finally { if (!request.signal.aborted) setSearching(false); }
  }

  return <div className="grid min-w-0 gap-3">
    <div className="relative z-30">
      <Field>
        <FieldLabel htmlFor="location-search">{language === "fil" ? "Maghanap sa Albay" : "Search in Albay"}</FieldLabel>
        <form onSubmit={handleSearch}><InputGroup><InputGroupInput id="location-search" type="search" placeholder={language === "fil" ? "Maghanap ng lugar" : "Search for a place"} value={query} onChange={(event) => setQuery(event.target.value)} aria-busy={searching} /><InputGroupAddon align="inline-end"><InputGroupButton type="submit" size="icon-sm" aria-label={language === "fil" ? "Maghanap" : "Search"} disabled={!query.trim() || searching}>{searching ? <Spinner aria-hidden="true" /> : <Search aria-hidden="true" />}</InputGroupButton></InputGroupAddon></InputGroup></form>
      </Field>
      {results.length > 0 && <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border bg-popover shadow-md" role="listbox" aria-label={language === "fil" ? "Mga mungkahing lugar" : "Suggested places"}>{results.map((result) => <Button key={result.id} type="button" variant="ghost" className="h-auto min-h-12 w-full justify-start rounded-none px-3 py-2 text-left hover:bg-accent" onClick={() => { onSelect(result.point, result.label); setResults([]); }}><span className="min-w-0 space-y-1"><span className="block font-semibold">{result.label}</span><span className="block text-sm font-normal text-muted-foreground">{result.description}</span></span></Button>)}</div>}
    </div>
    {error && <Alert variant="destructive"><TriangleAlert aria-hidden="true" /><AlertTitle>{language === "fil" ? "Hindi available ang paghahanap ng lokasyon" : "Location search unavailable"}</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
  </div>;
}
