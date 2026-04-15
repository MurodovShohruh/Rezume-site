'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  X, Sparkles, Loader2, Copy, Check, Download,
  Briefcase, Building2
} from 'lucide-react';
import { aiApi } from '@/lib/queries';
import { getErrorMessage } from '@/lib/api';
import { toast } from 'sonner';

interface CoverLetterModalProps {
  resumeId: string;
  resumeTitle: string;
  onClose: () => void;
}

export function CoverLetterModal({ resumeId, resumeTitle, onClose }: CoverLetterModalProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => aiApi.coverLetter(resumeId, jobTitle, companyName),
    onSuccess: (data) => {
      setResult(data.cover_letter);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Nusxa olindi!');
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${companyName || 'resume'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isValid = jobTitle.trim().length > 1 && companyName.trim().length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles size={15} className="text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-ink-900 text-sm">Motivatsion xat</h2>
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
            /* Input form */
            <div className="space-y-5">
              <p className="text-ink-500 text-sm">
                AI sizning rezumengiz asosida professional motivatsion xat yaratadi.
                Lavozim va kompaniya nomini kiriting.
              </p>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  <Briefcase size={13} className="inline mr-1.5 text-ink-400" />
                  Ish lavozimi
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="Frontend Developer, Marketing Manager..."
                  className="w-full border border-ink-200 rounded-xl px-4 py-2.5 text-sm text-ink-800
                    placeholder:text-ink-400 focus:outline-none focus:border-purple-400
                    focus:ring-1 focus:ring-purple-400/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  <Building2 size={13} className="inline mr-1.5 text-ink-400" />
                  Kompaniya nomi
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Google, Yandex, EPAM..."
                  className="w-full border border-ink-200 rounded-xl px-4 py-2.5 text-sm text-ink-800
                    placeholder:text-ink-400 focus:outline-none focus:border-purple-400
                    focus:ring-1 focus:ring-purple-400/30 transition-colors"
                />
              </div>

              <div className="bg-purple-50 rounded-xl p-4 text-xs text-purple-700 leading-relaxed">
                💡 AI sizning tajriba va ko'nikmalaringizni o'rganib, kompaniyaga mos
                professional motivatsion xat yozadi.
              </div>

              <button
                onClick={() => mutate()}
                disabled={!isValid || isPending}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500
                  disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-colors"
              >
                {isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Yaratilmoqda...</>
                ) : (
                  <><Sparkles size={16} /> Motivatsion xat yaratish</>
                )}
              </button>
            </div>
          ) : (
            /* Result */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-700">{jobTitle} — {companyName}</p>
                  <p className="text-xs text-ink-400">AI tomonidan yaratildi</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                      bg-ink-100 hover:bg-ink-200 text-ink-600 rounded-lg transition-colors"
                  >
                    {copied ? <Check size={12} className="text-sage-500" /> : <Copy size={12} />}
                    {copied ? 'Nusxa olindi' : 'Nusxa'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                      bg-ink-100 hover:bg-ink-200 text-ink-600 rounded-lg transition-colors"
                  >
                    <Download size={12} /> Yuklab olish
                  </button>
                </div>
              </div>

              <div className="bg-ink-50 rounded-xl p-5 text-sm text-ink-700 leading-relaxed
                whitespace-pre-wrap border border-ink-100 font-serif">
                {result}
              </div>

              <button
                onClick={() => { setResult(''); setJobTitle(''); setCompanyName(''); }}
                className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium
                  py-2 transition-colors"
              >
                ← Qaytadan yaratish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
