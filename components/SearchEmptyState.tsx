export function SearchEmptyState() {
  return (
    <li role="presentation" className="px-2.5 py-3">
      <p className="text-sm font-medium text-ink">No countries found.</p>
      <p className="mt-0.5 text-xs text-zinc-500">
        Try a different name or spelling.
      </p>
    </li>
  );
}
