import type { Country } from "@/types/country";

export const MIN_QUERY_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 350;
export const MAX_COUNTRY_RESULTS = 8;
export const SEARCH_ERROR_MESSAGE =
  "Something went wrong. Please try again.";

const SEARCH_URL = "https://countries.dev/name";
const SEARCH_FIELDS = "name,alpha2Code,flags,capital";

interface CountrySearchResponse {
  name: string;
  alpha2Code: string;
  capital?: string;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException || error instanceof Error) &&
    error.name === "AbortError"
  );
}

export function normalizeQuery(query: string): string {
  return query.trim();
}

export function canSearch(query: string): boolean {
  return normalizeQuery(query).length >= MIN_QUERY_LENGTH;
}

function toCountry(item: CountrySearchResponse): Country {
  const code = item.alpha2Code.toUpperCase();
  return {
    name: item.name,
    code,
    capital: item.capital,
    flagPng: `https://flagcdn.com/w80/${code.toLowerCase()}.png`,
    flagAlt: item.flags.alt ?? `Flag of ${item.name}`,
  };
}

function isCountrySearchResponse(value: unknown): value is CountrySearchResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<CountrySearchResponse>;
  return (
    typeof item.name === "string" &&
    typeof item.alpha2Code === "string" &&
    typeof item.flags?.png === "string"
  );
}

export async function searchCountries(
  query: string,
  options: { signal?: AbortSignal; limit?: number } = {},
): Promise<Country[]> {
  const normalized = normalizeQuery(query);
  if (normalized.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const limit = options.limit ?? MAX_COUNTRY_RESULTS;
  const url = new URL(`${SEARCH_URL}/${encodeURIComponent(normalized)}`);
  url.searchParams.set("fields", SEARCH_FIELDS);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, { signal: options.signal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Country search failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Country search returned an unexpected response");
  }

  return payload.filter(isCountrySearchResponse).map(toCountry).slice(0, limit);
}
