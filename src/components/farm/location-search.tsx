"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { searchLocations, type LocationResult } from "@/lib/location-search";
import type { FarmPoint } from "@/lib/farm";

export function LocationSearch({ onSelect }: {
  onSelect: (point: FarmPoint, name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [selected, setSelected] = useState<LocationResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLInputElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim() || searching) return;
    requestRef.current?.abort();
    const request = new AbortController();
    requestRef.current = request;
    setSearching(true);
    setSearched(false);
    setError("");
    setResults([]);
    setOpen(false);
    try {
      const matches = await searchLocations(query, request.signal);
      if (request.signal.aborted) return;
      setResults(matches);
      setSearched(true);
      const searchOwnsFocus = searchFormRef.current?.contains(document.activeElement);
      setOpen(!!searchOwnsFocus && matches.length > 0);
      if (searchOwnsFocus && matches.length > 0) resultsRef.current?.focus();
    } catch (cause) {
      if (request.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : "Location search failed. Try again or enter farm coordinates.");
    } finally {
      if (!request.signal.aborted) setSearching(false);
    }
  }

  function changeQuery(value: string) {
    setQuery(value);
    requestRef.current?.abort();
    setSearching(false);
    setSearched(false);
    setResults([]);
    setSelected(null);
    setError("");
    setOpen(false);
  }

  return (
    <form ref={searchFormRef} onSubmit={handleSearch} className="@container/location-search space-y-3">
      <div className="grid min-w-0 gap-3 @sm/location-search:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="location-results">Choose farm location</FieldLabel>
          <Combobox
            modal={false}
            items={results}
            filter={null}
            value={selected}
            inputValue={selected?.label ?? ""}
            open={open}
            onOpenChange={setOpen}
            itemToStringLabel={(item) => item.label}
            isItemEqualToValue={(item, value) => item.id === value.id}
            onValueChange={(value) => {
              setSelected(value);
              if (value) {
                onSelect(value.point, value.label);
                setOpen(false);
              }
            }}
          >
            <ComboboxInput
              ref={resultsRef}
              id="location-results"
              readOnly
              className="w-full min-w-0"
              placeholder="Choose a place"
              aria-describedby="location-search-help location-search-status"
              aria-busy={searching}
            />
            <ComboboxContent>
              <ComboboxEmpty>
                {searching ? "Searching Albay…" : searched ? "No places found. Try another name or enter coordinates." : "Search for a place to see available locations."}
              </ComboboxEmpty>
              <ComboboxList>
                {(result: LocationResult) => (
                  <ComboboxItem key={result.id} value={result}>
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold">{result.label}</p>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
        <Field>
          <FieldLabel htmlFor="location-search">Search in Albay</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="location-search"
              type="search"
              placeholder="Search for a place"
              className="text-left"
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              aria-describedby="location-search-help location-search-status"
              aria-busy={searching}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton type="submit" size="icon-sm" aria-label="Search" disabled={!query.trim() || searching} focusableWhenDisabled={searching}>
                {searching ? <Spinner aria-hidden="true" /> : <Search aria-hidden="true" />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
      <FieldDescription id="location-search-help" className="sr-only">Enter a barangay, city, or municipality and submit Search. Choose a result from the location dropdown with arrow keys and Enter.</FieldDescription>
      <p id="location-search-status" role="status" aria-live="polite" className={searching || searched ? "text-sm text-muted-foreground" : "sr-only"}>
        {searching ? "Searching for places in Albay…" : searched ? results.length ? `${results.length} places found in Albay.` : "No places found. Try another name or enter coordinates." : ""}
      </p>
      {error && (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Location search unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}

