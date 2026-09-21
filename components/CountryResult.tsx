import Image from "next/image";
import type { Country } from "@/types/country";

interface CountryResultProps {
  country: Country;
  id: string;
  isActive: boolean;
  onSelect: (country: Country) => void;
  onActive: () => void;
}

export function CountryResult({
  country,
  id,
  isActive,
  onSelect,
  onActive,
}: CountryResultProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={isActive}
      className={`flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 ${
        isActive ? "bg-highlight" : "bg-transparent"
      }`}
      onMouseEnter={onActive}
      onMouseDown={(event) => {
        event.preventDefault();
        onSelect(country);
      }}
    >
      <Image
        src={country.flagPng}
        alt=""
        width={28}
        height={20}
        className="h-5 w-7 shrink-0 rounded-sm object-cover ring-1 ring-black/10"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{country.name}</p>
        <p className="truncate text-xs text-zinc-500">
          {country.capital ? `${country.capital}` : null}
          {country.capital ? <span className="mx-1.5 text-zinc-300">·</span> : null}
          <span className="font-mono text-[11px] tracking-wide text-zinc-400">
            {country.code}
          </span>
        </p>
      </div>
    </li>
  );
}
