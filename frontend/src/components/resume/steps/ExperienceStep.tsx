'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { useResumeBuilderStore } from '@/store/resume.store';
import { MonthYearPicker } from '@/components/ui/MonthYearPicker';
import type { Experience } from '@/types';

const schema = z.object({
  company: z.string().min(1, 'Kompaniya nomi kiritilmadi'),
  position: z.string().min(1, 'Lavozim kiritilmadi'),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, 'Sana tanlanmadi'),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  description: z.string().min(1, 'Tavsif kiritilmadi'),
});
type FormData = z.infer<typeof schema>;

const inputCls = `w-full border border-ink-200 bg-white text-ink-900 placeholder:text-ink-300
  rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400
  focus:ring-2 focus:ring-amber-100 transition-all`;

const MONTHS_SHORT = ['Yan','Fev','Mar','Apr','May','Iyu','Iyu','Avg','Sen','Okt','Noy','Dek'];
const fmtDate = (d: string) => {
  const [y, m] = d.split('-');
  return `${MONTHS_SHORT[parseInt(m) - 1]} ${y}`;
};

export function ExperienceStep() {
  const { data, setData, setStep } = useResumeBuilderStore();
  const [experiences, setExperiences] = useState<Experience[]>(data.experience || []);
  const [adding, setAdding] = useState(experiences.length === 0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isCurrent: false },
  });

  const isCurrent = watch('isCurrent');
  const startDate = watch('startDate');

  const onAdd = (values: FormData) => {
    const exp: Experience = {
      ...values,
      endDate: values.isCurrent ? null : values.endDate || null,
    };
    setExperiences(prev => [...prev, exp]);
    reset({ isCurrent: false });
    setAdding(false);
  };

  const remove = (idx: number) =>
    setExperiences(prev => prev.filter((_, i) => i !== idx));

  const onNext = () => {
    setData({ experience: experiences });
    setStep(2);
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp, i) => (
        <div key={i} className="border border-ink-200 rounded-xl overflow-hidden bg-white">
          <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-ink-50 transition-colors"
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase size={16} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink-800 text-sm">{exp.position}</p>
              <p className="text-ink-400 text-xs">
                {exp.company} · {fmtDate(exp.startDate)} – {exp.isCurrent ? 'Hozir' : exp.endDate ? fmtDate(exp.endDate) : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-300
                  hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={14} />
              </button>
              {expanded === i ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}
            </div>
          </div>
          {expanded === i && (
            <div className="px-4 pb-4 border-t border-ink-100 pt-3">
              <p className="text-sm text-ink-600">{exp.description}</p>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleSubmit(onAdd)}
          className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-ink-800 text-sm">Yangi ish joyi qo'shish</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-ink-600 mb-1.5 block">Kompaniya nomi</label>
              <input {...register('company')} placeholder="Tech Startup" className={inputCls} />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-ink-600 mb-1.5 block">Lavozim</label>
              <input {...register('position')} placeholder="Frontend Developer" className={inputCls} />
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-ink-600 mb-1.5 block">Boshlanish sanasi</label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Oy va yil tanlang"
                    maxValue={new Date().toISOString().slice(0, 7)}
                  />
                )}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-ink-600 mb-1.5 block">Tugash sanasi</label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder={isCurrent ? 'Hozirgi ish joyi' : 'Oy va yil tanlang'}
                    disabled={isCurrent}
                    minValue={startDate || undefined}
                    maxValue={new Date().toISOString().slice(0, 7)}
                  />
                )}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input {...register('isCurrent')} type="checkbox"
              className="w-4 h-4 accent-amber-500 rounded" />
            <span className="text-sm text-ink-700">Hozir shu yerda ishlayman</span>
          </label>

          <div>
            <label className="text-xs font-medium text-ink-600 mb-1.5 block">
              Asosiy vazifalar va yutuqlar <span className="text-amber-600">(AI yaxshilaydi)</span>
            </label>
            <textarea {...register('description')} rows={3}
              placeholder="Kompaniyaning backend API ni yaratdim, 50+ endpointlar..."
              className={`${inputCls} resize-none`} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex gap-2">
            <button type="submit"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-ink-950
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
            hover:border-amber-300 hover:bg-amber-50/50 text-ink-400 hover:text-amber-600
            rounded-2xl py-4 text-sm font-medium transition-all">
          <Plus size={16} /> Ish joyi qo'shish
        </button>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={() => setStep(0)}
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
