"use client";

import { useRef, useState, type FormEvent } from "react";
import { Search, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { searchLocations, type LocationResult } from "@/lib/location-search";
import type { FarmPoint } from "@/lib/farm";

export function LocationSearch({ onSelect }: { onSelect: (point: FarmPoint, name: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [selected, setSelected] = useState<LocationResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || searching) return;
    requestRef.current?.abort();
    const request = new AbortController();
    requestRef.current = request;
    setSearching(true); setSearched(false); setError(""); setResults([]); setOpen(false);
    try {
      const matches = await searchLocations(trimmed, request.signal);
      if (request.signal.aborted) return;
      setResults(matches); setSearched(true); setOpen(matches.length > 0);
    } catch (cause) {
      if (request.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : "Location search failed. Try again.");
    } finally { if (!request.signal.aborted) setSearching(false); }
  }

  return <div className="grid min-w-0 gap-3 sm:grid-cols-2">
    <Field>
      <FieldLabel htmlFor="location-results">Choose farm location</FieldLabel>
      <Combobox<LocationResult> modal={false} items={results} filter={null} value={selected} inputValue={selected?.label ?? ""} open={open} onOpenChange={setOpen} itemToStringLabel={(item) => item.label} isItemEqualToValue={(item, value) => item.id === value.id} onValueChange={(value) => { setSelected(value); if (value) { onSelect(value.point, value.label); setOpen(false); } }}>
        <ComboboxInput id="location-results" readOnly placeholder="Choose a place" className="w-full" />
        <ComboboxContent><ComboboxEmpty>{searching ? "Searching Albay..." : searched ? "No places found. Try another name." : "Search for a place to see suggestions."}</ComboboxEmpty><ComboboxList>{(result: LocationResult) => <ComboboxItem key={result.id} value={result}><div className="min-w-0 space-y-1"><p className="font-semibold">{result.label}</p><p className="text-sm text-muted-foreground">{result.description}</p></div></ComboboxItem>}</ComboboxList></ComboboxContent>
      </Combobox>
    </Field>
    <Field>
      <FieldLabel htmlFor="location-search">Search in Albay</FieldLabel>
      <form onSubmit={handleSearch}><InputGroup><InputGroupInput id="location-search" type="search" placeholder="Search for a place" value={query} onChange={(event) => setQuery(event.target.value)} aria-busy={searching} /><InputGroupAddon align="inline-end"><InputGroupButton type="submit" size="icon-sm" aria-label="Search" disabled={!query.trim() || searching}>{searching ? <Spinner aria-hidden="true" /> : <Search aria-hidden="true" />}</InputGroupButton></InputGroupAddon></InputGroup></form>
    </Field>
    {error && <Alert variant="destructive" className="sm:col-span-2"><TriangleAlert aria-hidden="true" /><AlertTitle>Location search unavailable</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
  </div>;
}
