'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';
import { useResumeBuilderStore } from '@/store/resume.store';
import { YearPicker } from '@/components/ui/YearPicker';
import type { Education } from '@/types';

const schema = z.object({
  institution: z.string().min(1, "Muassasa nomi kiritilmadi"),
  degree: z.string().min(1, "Daraja kiritilmadi"),
  field: z.string().min(1, "Yo'nalish kiritilmadi"),
  startYear: z.coerce.number().min(1950, 'Yil tanlang'),
  endYear: z.coerce.number().min(1950).max(2035).optional().nullable(),
});
type FormData = z.infer<typeof schema>;

const inputCls = `w-full border border-ink-200 bg-white text-ink-900 placeholder:text-ink-300
  rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400
  focus:ring-2 focus:ring-amber-100 transition-all`;

export function EducationStep() {
  const { data, setData, setStep } = useResumeBuilderStore();
  const [educations, setEducations] = useState<Education[]>(data.education || []);
  const [adding, setAdding] = useState(educations.length === 0);

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const startYear = watch('startYear');

  const onAdd = (values: FormData) => {
    setEducations(prev => [...prev, values as Education]);
    reset();
    setAdding(false);
  };

  const onNext = () => {
    setData({ education: educations });
    setStep(3);
  };

  return (
    <div className="space-y-4">
      {educations.map((edu, i) => (
        <div key={i} className="flex items-center gap-4 bg-white border border-ink-200 rounded-xl p-4">
          <div className="w-9 h-9 bg-sage-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap size={16} className="text-sage-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink-800 text-sm">{edu.institution}</p>
            <p className="text-ink-400 text-xs">{edu.degree}, {edu.field} · {edu.startYear}–{edu.endYear ?? 'Hozir'}</p>
          </div>
          <button onClick={() => setEducations(prev => prev.filter((_, j) => j !== i))}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-300
              hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleSubmit(onAdd)}
          className="border border-sage-200 bg-sage-50/40 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-ink-800 text-sm">Ta'lim qo'shish</h3>

          <div>
            <label className="text-xs font-medium text-ink-600 mb-1.5 block">Muassasa nomi</label>
            <input {...register('institution')} placeholder="TATU, Toshkent Davlat Universiteti" className={inputCls} />
            {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-ink-600 mb-1.5 block">Daraja</label>
              <select {...register('degree')} className={inputCls}>
                <option value="">Tanlang</option>
                <option>Bakalavr</option>
                <option>Magistr</option>
                <option>Doktorantura (PhD)</option>
                <option>O'rta maxsus</option>
                <option>Kurs / Bootcamp</option>
              </select>
              {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-ink-600 mb-1.5 block">Yo'nalish</label>
              <input {...register('field')} placeholder="Dasturiy injiniring" className={inputCls} />
              {errors.field && <p className="text-red-500 text-xs mt-1">{errors.field.message}</p>}
            </div>

            {/* Kirish yili */}
            <div>
              <label className="text-xs font-medium text-ink-600 mb-1.5 block">Kirish yili</label>
              <Controller
                name="startYear"
                control={control}
                render={({ field }) => (
                  <YearPicker
                    value={field.value || null}
                    onChange={field.onChange}
                    placeholder="Yil tanlang"
                    maxYear={new Date().getFullYear()}
                  />
                )}
              />
              {errors.startYear && <p className="text-red-500 text-xs mt-1">{errors.startYear.message}</p>}
            </div>

            {/* Tugash yili */}
            <div>
              <label className="text-xs font-medium text-ink-600 mb-1.5 block">
                Tugash yili <span className="text-ink-400 font-normal">(ixtiyoriy)</span>
              </label>
              <Controller
                name="endYear"
                control={control}
                render={({ field }) => (
                  <YearPicker
                    value={field.value ?? null}
                    onChange={field.onChange}
                    placeholder="Yil tanlang"
                    minYear={startYear ? Number(startYear) : 1950}
                    maxYear={new Date().getFullYear() + 8}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit"
              className="flex items-center gap-1.5 bg-sage-500 hover:bg-sage-400 text-white
                font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
              <Plus size={15} /> Qo'shish
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="px-4 py-2.5 rounded-xl text-sm text-ink-500 hover:bg-ink-100 transition-colors">
              Bekor qilish
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-ink-200
            hover:border-sage-300 hover:bg-sage-50/50 text-ink-400 hover:text-sage-600
            rounded-2xl py-4 text-sm font-medium transition-all">
          <Plus size={16} /> Ta'lim qo'shish
        </button>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={() => setStep(1)}
          className="flex items-center gap-2 text-ink-500 hover:text-ink-700 font-medium text-sm transition-colors">
          <ArrowLeft size={16} /> Orqaga
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-ink-950
            font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
          Davom etish <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
