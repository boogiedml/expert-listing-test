export function CountryResultSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }, (_, index) => (
        <li
          key={index}
          role="presentation"
          className="flex items-center gap-3 rounded-md px-2.5 py-2"
        >
          <div className="h-5 w-7 shrink-0 animate-pulse rounded-sm bg-zinc-200 ring-1 ring-black/10" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              <span className="inline-block h-[0.85em] w-28 align-middle animate-pulse rounded-sm bg-zinc-200" />
            </p>
            <p className="truncate text-xs text-zinc-500">
              <span className="inline-block h-[0.85em] w-14 align-middle animate-pulse rounded-sm bg-zinc-200" />
              <span className="mx-1.5 text-zinc-300">·</span>
              <span className="inline-block h-[0.85em] w-5 align-middle animate-pulse rounded-sm bg-zinc-200" />
            </p>
          </div>
        </li>
      ))}
    </>
  );
}
