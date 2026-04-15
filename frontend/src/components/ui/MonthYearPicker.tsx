'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

interface MonthYearPickerProps {
  value: string;           // "YYYY-MM" yoki ""
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxValue?: string;       // "YYYY-MM" — bu sanadan kattasini tanlash mumkin emas
  minValue?: string;       // "YYYY-MM" — bu sanadan kichigini tanlash mumkin emas
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = 'Oy, yil tanlang',
  disabled = false,
  maxValue,
  minValue,
}: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Joriy ko'rsatilayotgan yil
  const parsed = value ? value.split('-') : null;
  const [viewYear, setViewYear] = useState<number>(
    parsed ? parseInt(parsed[0]) : new Date().getFullYear()
  );

  const selectedYear = parsed ? parseInt(parsed[0]) : null;
  const selectedMonth = parsed ? parseInt(parsed[1]) - 1 : null; // 0-indexed

  // Tashqarini bosganda yopish
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (monthIdx: number) => {
    const mm = String(monthIdx + 1).padStart(2, '0');
    const result = `${viewYear}-${mm}`;

    // min/max tekshiruvi
    if (minValue && result < minValue) return;
    if (maxValue && result > maxValue) return;

    onChange(result);
    setOpen(false);
  };

  const isMonthDisabled = (monthIdx: number) => {
    const mm = String(monthIdx + 1).padStart(2, '0');
    const candidate = `${viewYear}-${mm}`;
    if (minValue && candidate < minValue) return true;
    if (maxValue && candidate > maxValue) return true;
    return false;
  };

  const isToday = (monthIdx: number) => {
    const now = new Date();
    return viewYear === now.getFullYear() && monthIdx === now.getMonth();
  };

  const displayLabel = value
    ? `${MONTHS_UZ[parseInt(value.split('-')[1]) - 1]} ${value.split('-')[0]}`
    : '';

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen(o => !o);
            if (parsed) setViewYear(parseInt(parsed[0]));
          }
        }}
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
        <span className={displayLabel ? 'text-ink-900' : 'text-ink-300'}>
          {displayLabel || placeholder}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute z-50 top-[calc(100%+6px)] left-0
          bg-white border border-ink-200 rounded-2xl shadow-xl shadow-ink-900/10
          w-72 overflow-hidden animate-fade-in
        ">
          {/* Header — yil navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
            <button
              type="button"
              onClick={() => setViewYear(y => y - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="font-semibold text-ink-800 text-sm">{viewYear} yil</span>

            <button
              type="button"
              onClick={() => setViewYear(y => y + 1)}
              disabled={maxValue ? viewYear >= parseInt(maxValue.split('-')[0]) : false}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Oylar grid */}
          <div className="grid grid-cols-3 gap-1 p-3">
            {MONTHS_UZ.map((month, idx) => {
              const isSelected = selectedYear === viewYear && selectedMonth === idx;
              const isDisabled = isMonthDisabled(idx);
              const isCurrent = isToday(idx);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelect(idx)}
                  className={`
                    relative py-2.5 px-1 rounded-xl text-sm font-medium transition-all
                    ${isSelected
                      ? 'bg-amber-500 text-ink-950 shadow-md shadow-amber-200 scale-105'
                      : isDisabled
                        ? 'text-ink-200 cursor-not-allowed'
                        : isCurrent
                          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'text-ink-700 hover:bg-ink-100 hover:text-ink-900'
                    }
                  `}
                >
                  {month.slice(0, 3)}
                  {isCurrent && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2
                      w-1 h-1 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bugun tugmasi */}
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                handleSelect(now.getMonth());
              }}
              className="w-full text-center text-xs font-medium text-amber-600
                hover:text-amber-700 py-2 rounded-lg hover:bg-amber-50 transition-colors"
            >
              Bugun
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
