"use client";

import { useEffect, useState } from "react";
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_ERROR_MESSAGE,
  canSearch,
  isAbortError,
  normalizeQuery,
  searchCountries,
} from "@/lib/countries";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { Country } from "@/types/country";

interface SearchState {
  countries: Country[];
  error: string | null;
  queryKey: string;
}

const EMPTY_STATE: SearchState = {
  countries: [],
  error: null,
  queryKey: "",
};

export function useCountrySearch(query: string) {
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const [searchState, setSearchState] = useState<SearchState>(EMPTY_STATE);
  const [attempt, setAttempt] = useState(0);

  const normalizedQuery = normalizeQuery(query);
  const isSettled =
    canSearch(query) && normalizedQuery === normalizeQuery(debouncedQuery);

  if (!canSearch(query) && searchState.queryKey !== "") {
    setSearchState(EMPTY_STATE);
  }

  useEffect(() => {
    if (!canSearch(query) || normalizedQuery !== normalizeQuery(debouncedQuery)) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    searchCountries(debouncedQuery, { signal: controller.signal })
      .then((results) => {
        if (cancelled) {
          return;
        }
        setSearchState({
          countries: results,
          error: null,
          queryKey: normalizeQuery(debouncedQuery),
        });
      })
      .catch((reason: unknown) => {
        if (cancelled || isAbortError(reason)) {
          return;
        }
        setSearchState({
          countries: [],
          error: SEARCH_ERROR_MESSAGE,
          queryKey: normalizeQuery(debouncedQuery),
        });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [query, debouncedQuery, normalizedQuery, attempt]);

  function retry() {
    setSearchState({
      countries: [],
      error: null,
      queryKey: "",
    });
    setAttempt((current) => current + 1);
  }

  return {
    countries: canSearch(query) ? searchState.countries : [],
    isLoading: isSettled && searchState.queryKey !== normalizedQuery,
    error: canSearch(query) ? searchState.error : null,
    debouncedQuery,
    retry,
  };
}
