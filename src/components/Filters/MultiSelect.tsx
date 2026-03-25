import { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  paramKey: string;
  options: Option[];
  params: URLSearchParams;
  setParams: (p: URLSearchParams) => void;
}

export default function MultiSelect({
  label,
  paramKey,
  options,
  params,
  setParams,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = (params.get(paramKey) || "")
    .split(",")
    .filter(Boolean);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleValue = (value: string) => {
    const newParams = new URLSearchParams(params.toString());

    let updated = [...selected];

    if (updated.includes(value)) {
      updated = updated.filter((v) => v !== value);
    } else {
      updated.push(value);
    }

    if (updated.length) {
      newParams.set(paramKey, updated.join(","));
    } else {
      newParams.delete(paramKey);
    }

    setParams(newParams);
  };

  const displayText =
    selected.length === 0
      ? label
      : options
        .filter((o) => selected.includes(o.value))
        .map((o) => o.label)
        .join(", ");

  return (
    <div ref={ref} className="relative w-[200px]">

      <div
        onClick={() => setOpen(!open)}
        className="border px-3 py-2 rounded-lg bg-white flex justify-between items-center cursor-pointer"
      >
        <span className="text-sm truncate">{displayText}</span>
        <span>▾</span>
      </div>

      {open && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow z-50 max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => toggleValue(opt.value)}
              className="px-3 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                readOnly
              />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}