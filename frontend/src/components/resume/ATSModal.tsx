'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, BarChart2, Loader2, CheckCircle2, AlertCircle, Lightbulb, Tag } from 'lucide-react';
import { aiApi } from '@/lib/queries';
import { getErrorMessage } from '@/lib/api';
import { toast } from 'sonner';
import type { AtsResult } from '@/types';

interface ATSModalProps {
  resumeId: string;
  resumeTitle: string;
  onClose: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? '#22c55e' :
    score >= 60 ? '#f59e0b' :
    '#ef4444';
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-ink-900">{score}</span>
        <span className="text-xs text-ink-400">/100</span>
      </div>
    </div>
  );
}

function ScoreLabel({ score }: { score: number }) {
  if (score >= 80) return <span className="text-sage-600 font-semibold text-sm">Ajoyib ✓</span>;
  if (score >= 60) return <span className="text-amber-600 font-semibold text-sm">Yaxshi</span>;
  return <span className="text-red-500 font-semibold text-sm">Yaxshilash kerak</span>;
}

export function ATSModal({ resumeId, resumeTitle, onClose }: ATSModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AtsResult | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => aiApi.atsAnalysis(resumeId, jobDescription || undefined),
    onSuccess: (data) => setResult(data),
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart2 size={15} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-ink-900 text-sm">ATS Tahlil</h2>
              <p className="text-xs text-ink-400">{resumeTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400
              hover:text-ink-700 hover:bg-ink-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!result ? (
            /* Input */
            <div className="space-y-5">
              <p className="text-ink-500 text-sm leading-relaxed">
                ATS (Applicant Tracking System) — ko'plab kompaniyalar ishlatadigan avtomatik
                saralash tizimlari. AI rezumengizni ular uchun tahlil qiladi va ball beradi.
              </p>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  Vakansiya tavsifi{' '}
                  <span className="text-ink-400 font-normal">(ixtiyoriy)</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  rows={5}
                  placeholder="Vakansiya talablarini yoki ish tavsifini kiriting. Bu tahlilni aniqroq qiladi..."
                  className="w-full border border-ink-200 rounded-xl px-4 py-3 text-sm text-ink-800
                    placeholder:text-ink-400 focus:outline-none focus:border-blue-400
                    focus:ring-1 focus:ring-blue-400/30 transition-colors resize-none"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
                💡 Vakansiya tavsifini qo'shsangiz AI kalit so'zlarni solishtirib, aniqroq tavsiyalar beradi.
              </div>

              <button
                onClick={() => mutate()}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500
                  disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-colors"
              >
                {isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Tahlil qilinmoqda...</>
                ) : (
                  <><BarChart2 size={16} /> ATS ballini hisoblash</>
                )}
              </button>
            </div>
          ) : (
            /* Result */
            <div className="space-y-6">
              {/* Score */}
              <div className="text-center">
                <ScoreRing score={result.score} />
                <div className="mt-3">
                  <ScoreLabel score={result.score} />
                </div>
                <p className="text-xs text-ink-400 mt-1">ATS mos kelish darajasi</p>
              </div>

              {/* Kuchli tomonlar */}
              {result.strengths?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-800 mb-3">
                    <CheckCircle2 size={15} className="text-sage-500" /> Kuchli tomonlar
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                        <span className="text-sage-500 mt-0.5">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Zaif tomonlar */}
              {result.weaknesses?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-800 mb-3">
                    <AlertCircle size={15} className="text-amber-500" /> Yaxshilash kerak
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                        <span className="text-amber-500 mt-0.5">!</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Yo'q kalit so'zlar */}
              {result.missing_keywords?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-800 mb-3">
                    <Tag size={15} className="text-red-400" /> Qo'shish kerak bo'lgan kalit so'zlar
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs bg-red-50 text-red-600 border border-red-200
                          px-2.5 py-1 rounded-full"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tavsiyalar */}
              {result.suggestions?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-800 mb-3">
                    <Lightbulb size={15} className="text-amber-400" /> Tavsiyalar
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                        <span className="text-amber-400 mt-0.5">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => { setResult(null); setJobDescription(''); }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium
                  py-2 transition-colors border border-blue-200 rounded-xl hover:bg-blue-50"
              >
                ← Qaytadan tahlil qilish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
