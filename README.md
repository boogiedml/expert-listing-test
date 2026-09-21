# Country search

Autocomplete that queries countries as you type. Pick a result and it fills the input plus a small summary underneath.

## Run it

```bash
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000)

```bash
pnpm lint
pnpm build
```

## What I built

A single-page Next.js app (App Router, React, TypeScript, Tailwind). Search state lives in the component — no Redux or extra UI kit.

The brief pointed at REST Countries v3.1:

`https://restcountries.com/v3.1/name/{query}?fields=name,cca2,flags,capital`

That version is gone now (deprecated payload; v5 wants an API key). I used the public, keyless equivalent instead:

`https://countries.dev/name/{query}?fields=name,alpha2Code,flags,capital&limit=8`

- `200` — matches
- `404` — empty list (“No countries found.”)
- anything else — “Something went wrong. Please try again.”

The UI never dumps raw API errors.

Search waits 350ms after typing, trims the query, and ignores anything under 2 characters. That is the debounce: without it every keystroke would hit the network.

Out-of-order responses are handled with `AbortController`. A new search aborts the previous one; `AbortError` is ignored so a slow `"nig"` response cannot overwrite `"nige"`.

Keyboard: arrows move, Home/End jump, Enter selects (or retries after an error), Escape closes. Focus stays on the input. Combobox ARIA is wired (`aria-expanded`, `aria-controls`, `aria-activedescendant`, listbox/options). A live region announces status for screen readers.

## If this had real traffic

I would not ship the browser straight to a third-party API. Put a small backend in front, cache by normalised query, collapse duplicate in-flight lookups, cap result size (already at 8), rate-limit, and watch error rate / latency. Debounce and the min-length check stay useful on the client.
