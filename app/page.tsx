import { CountryAutocomplete } from "@/components/CountryAutocomplete";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-16 sm:py-20">
      <h1 className="text-xl font-semibold tracking-tight text-ink">
        Country search
      </h1>
      <p className="mt-1.5 mb-6 text-sm text-zinc-500">
        Type at least two letters. Use the arrow keys to move, Enter to pick.
      </p>
      <CountryAutocomplete />
    </main>
  );
}
