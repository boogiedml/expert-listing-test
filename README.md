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

## Write-up

I built a country typeahead in the existing Next.js + Tailwind app. REST Countries v3.1 is deprecated (v5 wants a key), so I used countries.dev instead of faking data or wiring up an API key for a screening task.

Search stays in the browser on purpose. A BFF would have been cleaner for caching, but it felt like extra surface area here. Debounce is 350ms, nothing fires under 2 characters after trim, and I cap results at 8. Stale responses use AbortController: a new search aborts the previous one so a slow `"nig"` can’t overwrite `"nige"`. Flags go through Flagcdn + `next/image` because the Wikimedia URLs from the API were unreliable.

No extra UI or state libraries — local React state is enough. Keyboard nav (arrows, Home/End, Enter, Escape) stays on the input so focus never jumps into the list. Loading is skeleton rows that match the result layout so the dropdown doesn’t jump.

If this had real traffic I wouldn’t let the client hit a third-party API. I’d put a thin backend in front, cache by normalised query, collapse duplicate in-flight lookups, rate-limit, and watch error rate / latency. Debounce and the min-length check would still live on the client.

I didn’t add a test suite for this. I’d unit-test query trim/min-length, debounce, and abort (slow first request must not win), then a few Playwright cases for keyboard nav, empty/error, and selecting a result.
