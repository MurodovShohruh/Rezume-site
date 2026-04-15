'use client';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Shaxsiy',    sub: 'Asosiy ma\'lumotlar' },
  { label: 'Tajriba',    sub: 'Ish tarixi' },
  { label: 'Ta\'lim',   sub: 'O\'qish joylari' },
  { label: 'Ko\'nikmalar', sub: 'Skills & tillar' },
  { label: 'Shablon',   sub: 'Dizayn tanlash' },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                done   && 'bg-sage-500 text-white',
                active && 'bg-amber-500 text-ink-950 ring-4 ring-amber-200',
                !done && !active && 'bg-ink-100 text-ink-400',
              )}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              {/* Label */}
              <span className={cn(
                'text-xs font-medium whitespace-nowrap hidden sm:block',
                active ? 'text-amber-600' : done ? 'text-sage-600' : 'text-ink-400',
              )}>
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className={cn(
                'h-0.5 w-10 md:w-16 mx-1 mt-[-12px] transition-colors',
                i < current ? 'bg-sage-400' : 'bg-ink-200',
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
