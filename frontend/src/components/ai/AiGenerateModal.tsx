'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sparkles, X, Loader2, Check, ChevronDown } from 'lucide-react';
import { aiApi } from '@/lib/queries';
import { getErrorMessage } from '@/lib/api';

interface Props {
  resumeId: string;
  onClose: () => void;
}

export function AiGenerateModal({ resumeId, onClose }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => aiApi.generate(resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      toast.success('AI muvaffaqiyatli generatsiya qildi! ✨');
      onClose();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-up">

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
            rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors">
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl
          flex items-center justify-center mb-5 shadow-lg shadow-amber-200">
          <Sparkles size={26} className="text-white" />
        </div>

        <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">
          AI bilan yaxshilash
        </h2>
        <p className="text-ink-500 text-sm mb-6 leading-relaxed">
          Claude AI sizning ish tajribangizni professional tilda qayta yozadi,
          grammatikani to'g'rilaydi va ATS kalit so'zlarini qo'shadi.
        </p>

        {/* What AI does */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 space-y-2.5">
          {[
            'Qisqacha tavsifni professional tilda yozadi',
            'Ish tajribasi tavsiflarini kengaytiradi',
            'Grammatika va uslubni to\'g\'rilaydi',
            'ATS kalit so\'zlarini qo\'shadi',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-amber-800">
              <Check size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-ink-200 text-sm font-medium
              text-ink-600 hover:bg-ink-50 transition-colors">
            Keyinroq
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400
              disabled:opacity-60 text-ink-950 font-semibold py-3 rounded-xl text-sm transition-colors">
            {mutation.isPending ? (
              <><Loader2 size={15} className="animate-spin" /> Ishlanmoqda...</>
            ) : (
              <><Sparkles size={15} /> Yaxshilash</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
