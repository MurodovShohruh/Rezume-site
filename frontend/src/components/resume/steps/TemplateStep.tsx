'use client';
import { useResumeBuilderStore } from '@/store/resume.store';
import { TEMPLATES, LANGUAGES, cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { TemplateId, LanguageCode } from '@/types';

export function TemplateStep() {
  const { templateId, language, setTemplateId, setLanguage } = useResumeBuilderStore();

  return (
    <div className="space-y-8">
      {/* Template selection */}
      <div>
        <h3 className="font-semibold text-ink-900 mb-1">Shablon tanlang</h3>
        <p className="text-sm text-ink-400 mb-4">Rezumengizning ko'rinishini tanlang</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id as TemplateId)}
              className={cn(
                'group relative text-left p-4 rounded-xl border-2 transition-all duration-200',
                templateId === t.id
                  ? 'border-amber-400 bg-amber-50 shadow-glow'
                  : 'border-ink-200 bg-white hover:border-ink-400 hover:shadow-card'
              )}
            >
              {/* Color swatch */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: t.color }} />
                <span className="font-semibold text-sm text-ink-800">{t.name}</span>
                {templateId === t.id && (
                  <span className="ml-auto w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <Check size={12} strokeWidth={2.5} className="text-ink-950" />
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-400 pl-11">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Language selection */}
      <div>
        <h3 className="font-semibold text-ink-900 mb-1">Til tanlang</h3>
        <p className="text-sm text-ink-400 mb-4">AI rezumeni qaysi tilda yozsin?</p>
        <div className="flex gap-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code as LanguageCode)}
              className={cn(
                'flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 font-medium text-sm transition-all',
                language === l.code
                  ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-glow'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-400'
              )}
            >
              <span className="text-lg">{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
