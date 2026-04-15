'use client';
import { useState } from 'react';
import { Mail, X, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/queries';
import { useAuthStore } from '@/store/auth.store';

export function EmailVerificationBanner() {
  const user = useAuthStore(s => s.user);
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || user.is_verified || dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await authApi.resendVerification();
      setSent(true);
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
      <Mail size={16} className="text-amber-600 flex-shrink-0" />
      <p className="text-amber-800 text-sm flex-1">
        <span className="font-medium">Email manzilingiz tasdiqlanmagan.</span>{' '}
        {sent
          ? 'Tasdiqlash xati yuborildi — xatingizni tekshiring.'
          : 'Barcha imkoniyatlardan foydalanish uchun emailingizni tasdiqlang.'}
      </p>
      {!sent && (
        <button
          onClick={handleResend}
          disabled={sending}
          className="text-amber-700 hover:text-amber-900 font-medium text-sm flex items-center gap-1
            whitespace-nowrap transition-colors disabled:opacity-60"
        >
          {sending ? <Loader2 size={12} className="animate-spin" /> : null}
          Tasdiqlash xatini yuborish
        </button>
      )}
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
