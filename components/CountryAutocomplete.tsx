"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CountryResult } from "@/components/CountryResult";
import { CountryResultSkeleton } from "@/components/CountryResultSkeleton";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { SearchErrorState } from "@/components/SearchErrorState";
import { SelectedCountry } from "@/components/SelectedCountry";
import { canSearch, normalizeQuery } from "@/lib/countries";
import {
  firstHighlight,
  lastHighlight,
  moveHighlight,
} from "@/lib/list-navigation";
import { useCountrySearch } from "@/lib/use-country-search";
import type { Country } from "@/types/country";

export function CountryAutocomplete() {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlight, setHighlight] = useState({ key: "", index: -1 });
  const [selected, setSelected] = useState<Country | null>(null);

  const searchQuery =
    selected && selected.name === normalizeQuery(query) ? "" : query;
  const { countries, isLoading, error, debouncedQuery, retry } =
    useCountrySearch(searchQuery);

  const resultsKey = countries.map((country) => country.code).join("|");
  if (highlight.key !== resultsKey) {
    setHighlight({
      key: resultsKey,
      index: firstHighlight(countries.length),
    });
  }

  const highlightedIndex = highlight.index;

  const isQuerySettled =
    normalizeQuery(searchQuery) === normalizeQuery(debouncedQuery);
  const isPending = isLoading || (canSearch(searchQuery) && !isQuerySettled);
  const showDropdown = isOpen && canSearch(searchQuery);
  const activeOptionId =
    showDropdown && highlightedIndex >= 0
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  useEffect(() => {
    if (!activeOptionId) {
      return;
    }
    document.getElementById(activeOptionId)?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [activeOptionId]);

  let statusMessage = "";
  if (showDropdown) {
    if (isPending) {
      statusMessage = "Searching";
    } else if (error) {
      statusMessage = error;
    } else if (countries.length === 0) {
      statusMessage = "No countries found.";
    } else {
      statusMessage = `${countries.length} ${countries.length === 1 ? "country" : "countries"} found`;
    }
  }

  function selectCountry(country: Country) {
    setSelected(country);
    setQuery(country.name);
    setIsOpen(false);
    setHighlight({ key: "", index: -1 });
    inputRef.current?.focus();
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setIsOpen(canSearch(value));
    if (!canSearch(value)) {
      setHighlight({ key: "", index: -1 });
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setHighlight({ key: resultsKey, index: -1 });
      return;
    }

    if (!showDropdown) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((current) => ({
        key: resultsKey,
        index: moveHighlight(current.index, 1, countries.length),
      }));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((current) => ({
        key: resultsKey,
        index: moveHighlight(current.index, -1, countries.length),
      }));
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setHighlight({
        key: resultsKey,
        index: firstHighlight(countries.length),
      });
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setHighlight({
        key: resultsKey,
        index: lastHighlight(countries.length),
      });
      return;
    }

    if (event.key === "Enter") {
      if (error) {
        event.preventDefault();
        retry();
        return;
      }
      const country = countries[highlightedIndex];
      if (!country) {
        return;
      }
      event.preventDefault();
      selectCountry(country);
    }
  }

  return (
    <div>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search for a country"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          autoComplete="off"
          spellCheck={false}
          placeholder="Search for a country..."
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (canSearch(searchQuery)) {
              setIsOpen(true);
            }
          }}
          onBlur={() => setIsOpen(false)}
          className="h-11 w-full rounded-lg border border-rule bg-white pl-10 pr-3 text-sm text-ink shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
        />
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-zinc-400">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.25" />
            <path
              d="M10.2 10.2 13 13"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <ul
          id={listboxId}
          role="listbox"
          hidden={!showDropdown}
          aria-label="Country suggestions"
          className="absolute z-10 mt-1.5 max-h-72 w-full overflow-auto rounded-lg border border-rule bg-white p-1 shadow-md"
        >
          {showDropdown && error ? <SearchErrorState onRetry={retry} /> : null}

          {showDropdown && !error && isPending ? <CountryResultSkeleton /> : null}

          {showDropdown && !error && !isPending && countries.length === 0 ? (
            <SearchEmptyState />
          ) : null}

          {showDropdown && !error && !isPending
            ? countries.map((country, index) => (
                <CountryResult
                  key={country.code}
                  id={`${listboxId}-option-${index}`}
                  country={country}
                  isActive={index === highlightedIndex}
                  onSelect={selectCountry}
                  onActive={() =>
                    setHighlight({ key: resultsKey, index })
                  }
                />
              ))
            : null}
        </ul>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </p>

      {selected ? <SelectedCountry country={selected} /> : null}
    </div>
  );
}
