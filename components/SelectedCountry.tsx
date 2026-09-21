import Image from "next/image";
import type { Country } from "@/types/country";

interface SelectedCountryProps {
  country: Country;
}

export function SelectedCountry({ country }: SelectedCountryProps) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg border border-rule bg-white px-3 py-3">
      <Image
        src={country.flagPng}
        alt={country.flagAlt}
        width={48}
        height={32}
        className="h-8 w-12 shrink-0 rounded-sm object-cover ring-1 ring-black/10"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{country.name}</p>
        <p className="mt-0.5 truncate text-xs text-zinc-500">
          {country.capital ? `${country.capital}` : null}
          {country.capital ? <span className="mx-1.5 text-zinc-300">·</span> : null}
          <span className="font-mono tracking-wide text-zinc-400">
            {country.code}
          </span>
        </p>
      </div>
    </div>
  );
}
