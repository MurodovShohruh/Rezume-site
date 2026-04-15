'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface YearPickerProps {
  value: number | null | undefined;
  onChange: (year: number) => void;
  placeholder?: string;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
}

const CURRENT_YEAR = new Date().getFullYear();
const PAGE_SIZE = 12; // bir sahifada nechta yil

export function YearPicker({
  value,
  onChange,
  placeholder = 'Yil tanlang',
  disabled = false,
  minYear = 1950,
  maxYear = CURRENT_YEAR + 10,
}: YearPickerProps) {
  const [open, setOpen] = useState(false);
  // Sahifaning boshlang'ich yili
  const [pageStart, setPageStart] = useState<number>(() => {
    const base = value ?? CURRENT_YEAR;
    return Math.floor((base - minYear) / PAGE_SIZE) * PAGE_SIZE + minYear;
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const years = Array.from(
    { length: PAGE_SIZE },
    (_, i) => pageStart + i
  ).filter(y => y >= minYear && y <= maxYear);

  const canPrev = pageStart - PAGE_SIZE >= minYear;
  const canNext = pageStart + PAGE_SIZE <= maxYear;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) setOpen(o => !o); }}
        className={`
          w-full flex items-center gap-2 border rounded-xl px-4 py-3 text-sm text-left
          transition-all focus:outline-none
          ${disabled
            ? 'border-ink-100 bg-ink-50 text-ink-300 cursor-not-allowed'
            : open
              ? 'border-amber-400 ring-2 ring-amber-100 bg-white text-ink-900'
              : 'border-ink-200 bg-white text-ink-900 hover:border-amber-300'
          }
        `}
      >
        <CalendarDays size={15} className={disabled ? 'text-ink-300' : 'text-ink-400'} />
        <span className={value ? 'text-ink-900' : 'text-ink-300'}>
          {value || placeholder}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute z-50 top-[calc(100%+6px)] left-0
          bg-white border border-ink-200 rounded-2xl shadow-xl shadow-ink-900/10
          w-64 overflow-hidden animate-fade-in
        ">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setPageStart(s => s - PAGE_SIZE)}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="font-semibold text-ink-800 text-sm">
              {pageStart} – {Math.min(pageStart + PAGE_SIZE - 1, maxYear)}
            </span>

            <button
              type="button"
              disabled={!canNext}
              onClick={() => setPageStart(s => s + PAGE_SIZE)}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Yillar grid */}
          <div className="grid grid-cols-3 gap-1 p-3">
            {years.map(year => {
              const isSelected = value === year;
              const isCurrentYear = year === CURRENT_YEAR;

              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => { onChange(year); setOpen(false); }}
                  className={`
                    relative py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isSelected
                      ? 'bg-amber-500 text-ink-950 shadow-md shadow-amber-200 scale-105'
                      : isCurrentYear
                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                        : 'text-ink-700 hover:bg-ink-100 hover:text-ink-900'
                    }
                  `}
                >
                  {year}
                  {isCurrentYear && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2
                      w-1 h-1 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Joriy yil */}
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={() => {
                onChange(CURRENT_YEAR);
                setOpen(false);
              }}
              className="w-full text-center text-xs font-medium text-amber-600
                hover:text-amber-700 py-2 rounded-lg hover:bg-amber-50 transition-colors"
            >
              Joriy yil ({CURRENT_YEAR})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
