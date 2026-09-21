interface SearchErrorStateProps {
  onRetry: () => void;
}

export function SearchErrorState({ onRetry }: SearchErrorStateProps) {
  return (
    <li role="presentation" className="px-2.5 py-3">
      <p className="text-sm font-medium text-ink">Couldn&apos;t load results</p>
      <p className="mt-0.5 text-xs text-zinc-500">
        Something went wrong. Please try again.
      </p>
      <button
        type="button"
        className="mt-2.5 rounded-md border border-rule bg-white px-2.5 py-1 text-xs font-medium text-ink hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onRetry}
      >
        Try again
      </button>
    </li>
  );
}
