'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/queries';
import { useAuthStore } from '@/store/auth.store';
import { getErrorMessage } from '@/lib/api';

const schema = z.object({
  email: z.string().email('To\'g\'ri email kiriting'),
  password: z.string().min(1, 'Parol kiritilmadi'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore(s => s.login);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authApi.login(data);
      login(result);
      toast.success('Xush kelibsiz! 👋');
      router.push('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-2xl font-bold text-amber-400">
            Resume<span className="text-ink-200">AI</span>
          </Link>
          <p className="text-ink-400 mt-2 text-sm">Hisobingizga kiring</p>
        </div>

        {/* Form card */}
        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-8 shadow-xl shadow-ink-950/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="ali@example.com"
                className="w-full bg-ink-800 border border-ink-600 text-ink-100 placeholder:text-ink-600
                  rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1
                  focus:ring-amber-500/30 transition-colors"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Parol</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-ink-800 border border-ink-600 text-ink-100 placeholder:text-ink-600
                    rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-amber-500
                    focus:ring-1 focus:ring-amber-500/30 transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400
                disabled:opacity-60 text-ink-950 font-semibold rounded-lg py-3 transition-colors mt-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>
                Kirish <ArrowRight size={16} />
              </>}
            </button>
          </form>
        </div>

        <p className="text-center text-ink-500 text-sm mt-6">
          Hisob yo'qmi?{' '}
          <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
}
