'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeBuilderStore } from '@/store/resume.store';
import type { PersonalInfo } from '@/types';
import { ArrowRight } from 'lucide-react';

const schema = z.object({
  fullName: z.string().min(2, 'Ism kiritilmadi'),
  email: z.string().email('To\'g\'ri email kiriting'),
  phone: z.string().min(7, 'Telefon raqam kiritilmadi'),
  city: z.string().min(1, 'Shahar kiritilmadi'),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  summary: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const Field = ({ label, error, children, optional = false }: {
  label: string; error?: string; children: React.ReactNode; optional?: boolean;
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-2">
      {label}
      {optional && <span className="text-xs text-ink-400 font-normal">(ixtiyoriy)</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const inputCls = `w-full border border-ink-200 bg-white text-ink-900 placeholder:text-ink-300
  rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400
  focus:ring-2 focus:ring-amber-100 transition-all`;

export function PersonalStep() {
  const { data, setData, setStep } = useResumeBuilderStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data.personal as FormData,
  });

  const onSubmit = (values: FormData) => {
    setData({ personal: values as PersonalInfo });
    setStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="To'liq ism" error={errors.fullName?.message}>
          <input {...register('fullName')} placeholder="Ali Valiyev" className={inputCls} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register('email')} type="email" placeholder="ali@example.com" className={inputCls} />
        </Field>
        <Field label="Telefon" error={errors.phone?.message}>
          <input {...register('phone')} placeholder="+998 90 123 45 67" className={inputCls} />
        </Field>
        <Field label="Shahar" error={errors.city?.message}>
          <input {...register('city')} placeholder="Toshkent" className={inputCls} />
        </Field>
      </div>

      <Field label="LinkedIn" error={errors.linkedin?.message} optional>
        <input {...register('linkedin')} placeholder="https://linkedin.com/in/username" className={inputCls} />
      </Field>
      <Field label="GitHub" error={errors.github?.message} optional>
        <input {...register('github')} placeholder="https://github.com/username" className={inputCls} />
      </Field>
      <Field label="Portfolio" error={errors.portfolio?.message} optional>
        <input {...register('portfolio')} placeholder="https://mysite.com" className={inputCls} />
      </Field>

      <Field label="Qisqacha tavsif (About me)" optional>
        <textarea
          {...register('summary')}
          rows={4}
          placeholder="O'zingiz haqingizda 2-3 jumlada yozing. AI keyinchalik buni yaxshilab beradi..."
          className={`${inputCls} resize-none`}
        />
      </Field>

      <div className="flex justify-end pt-2">
        <button type="submit"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-ink-950
            font-semibold px-6 py-3 rounded-xl transition-colors">
          Davom etish <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
