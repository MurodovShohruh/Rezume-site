'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { authApi } from '@/lib/queries';
import { useAuthStore } from '@/store/auth.store';

type State = 'loading' | 'success' | 'error' | 'idle';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { setUser, user } = useAuthStore();
  const [state, setState] = useState<State>(token ? 'loading' : 'idle');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) return;
    authApi.verifyEmail(token)
      .then((data) => {
        if (data.user) setUser(data.user);
        setState('success');
      })
      .catch(() => setState('error'));
  }, [token, setUser]);

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerification();
      setResent(true);
    } catch {
      /* ignore */
    } finally {
      setResending(false);
    }
  };

  if (state === 'idle') {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center animate-fade-up">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-ink-100 mb-3">Emailingizni tasdiqlang</h1>
          <p className="text-ink-400 text-sm leading-relaxed mb-8">
            Ro'yxatdan o'tganingizdan so'ng emailingizga tasdiqlash havolasi yuborildi.
            Iltimos, xatingizni tekshiring va havolani bosing.
          </p>
          {user && !user.is_verified && (
            <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6 mb-6">
              <p className="text-ink-300 text-sm mb-4">Xat kelmadimi? Qayta yuborishimiz mumkin.</p>
              {resent ? (
                <p className="text-sage-400 text-sm font-medium">✓ Xat yuborildi!</p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full flex items-center justify-center gap-2 bg-ink-800 hover:bg-ink-700
                    text-ink-200 font-medium rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60"
                >
                  {resending ? <Loader2 size={14} className="animate-spin" /> : null}
                  Qayta yuborish
                </button>
              )}
            </div>
          )}
          <Link href="/dashboard" className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
            Dashboard ga o'tish →
          </Link>
        </div>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <Loader2 size={40} className="animate-spin text-amber-400 mx-auto mb-4" />
          <p className="text-ink-400">Tasdiqlash amalga oshirilmoqda...</p>
        </div>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center animate-fade-up">
          <div className="w-16 h-16 bg-sage-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-sage-400" />
          </div>
          <h1 className="text-xl font-bold text-ink-100 mb-3">Email tasdiqlandi! 🎉</h1>
          <p className="text-ink-400 text-sm mb-8">
            Hisobingiz faollashtirildi. Endi barcha imkoniyatlardan foydalanishingiz mumkin.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-ink-950 font-semibold rounded-xl py-3 transition-colors"
          >
            Dashboard ga o'tish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center animate-fade-up">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={36} className="text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-ink-100 mb-3">Havola noto'g'ri</h1>
        <p className="text-ink-400 text-sm mb-8">
          Token muddati o'tgan yoki noto'g'ri. Yangi tasdiqlash xati olishingiz mumkin.
        </p>
        {user && (
          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400
              disabled:opacity-60 text-ink-950 font-semibold rounded-xl py-3 transition-colors mb-4"
          >
            {resending ? <Loader2 size={16} className="animate-spin" /> : null}
            {resent ? 'Xat yuborildi ✓' : 'Yangi xat yuborish'}
          </button>
        )}
        <Link href="/login" className="text-ink-500 hover:text-ink-300 text-sm transition-colors">
          Loginga qaytish
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-amber-400" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
