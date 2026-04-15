'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, Sparkles, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StepIndicator } from '@/components/resume/StepIndicator';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { AiGenerateModal } from '@/components/ai/AiGenerateModal';
import { PersonalStep } from '@/components/resume/steps/PersonalStep';
import { ExperienceStep } from '@/components/resume/steps/ExperienceStep';
import { EducationStep } from '@/components/resume/steps/EducationStep';
import { SkillsStep } from '@/components/resume/steps/SkillsStep';
import { TemplateStep } from '@/components/resume/steps/TemplateStep';
import { useResumeBuilderStore } from '@/store/resume.store';
import { resumeApi } from '@/lib/queries';
import { getErrorMessage } from '@/lib/api';

const STEPS = [PersonalStep, ExperienceStep, EducationStep, SkillsStep, TemplateStep];

export default function NewResumePage() {
  const router = useRouter();
  const store = useResumeBuilderStore();
  const [showAI, setShowAI] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => { store.reset(); }, []);

  const saveMut = useMutation({
    mutationFn: () => resumeApi.create({
      title: store.title,
      template_id: store.templateId,
      data: store.data,
      language: store.language,
    }),
    onSuccess: (resume) => {
      setCreatedId(resume.id);
      toast.success('Saqlandi ✓');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const updateMut = useMutation({
    mutationFn: () => resumeApi.update(createdId!, {
      title: store.title,
      template_id: store.templateId,
      data: store.data,
      language: store.language,
    }),
    onSuccess: () => toast.success('Saqlandi ✓'),
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSave = async () => {
    if (createdId) await updateMut.mutateAsync();
    else await saveMut.mutateAsync();
  };

  const handleNext = async () => {
    try { await handleSave(); } catch { return; }
    if (store.currentStep < STEPS.length - 1) store.setStep(store.currentStep + 1);
  };

  const handleFinish = async () => {
    try { await handleSave(); } catch { return; }
    router.push('/dashboard');
  };

  const StepComponent = STEPS[store.currentStep];
  const isSaving = saveMut.isPending || updateMut.isPending;
  const isLastStep = store.currentStep === STEPS.length - 1;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-ink-50 p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
          <button onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-ink-500 hover:text-ink-800 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Dashboard
          </button>
          <input
            value={store.title}
            onChange={e => store.setTitle(e.target.value)}
            className="font-display text-xl font-semibold text-ink-900 text-center bg-transparent
              border-b-2 border-transparent hover:border-ink-300 focus:border-amber-400 focus:outline-none
              px-2 py-1 transition-colors w-72"
          />
          <div className="flex items-center gap-2">
            {createdId && (
              <button onClick={() => setShowAI(true)}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg
                  bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200 transition-colors">
                <Sparkles size={15} /> AI Yaxshilash
              </button>
            )}
            <button onClick={handleSave} disabled={isSaving}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg
                bg-ink-900 hover:bg-ink-800 text-ink-50 transition-colors disabled:opacity-50">
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Saqlash
            </button>
          </div>
        </div>

        <div className="mb-8 max-w-6xl mx-auto">
          <StepIndicator current={store.currentStep} />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Form */}
          <div className="bg-white border border-ink-200 rounded-2xl p-7 shadow-card animate-fade-in">
            <StepComponent />
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink-100">
              <button onClick={() => store.setStep(store.currentStep - 1)}
                disabled={store.currentStep === 0}
                className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl
                  border border-ink-200 text-ink-600 hover:bg-ink-50 transition-colors disabled:opacity-30">
                <ArrowLeft size={16} /> Orqaga
              </button>
              {isLastStep ? (
                <button onClick={handleFinish} disabled={isSaving}
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl
                    bg-amber-500 hover:bg-amber-400 text-ink-950 transition-colors shadow-sm shadow-amber-200 disabled:opacity-50">
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  Tugatish va Saqlash ✓
                </button>
              ) : (
                <button onClick={handleNext} disabled={isSaving}
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl
                    bg-ink-900 hover:bg-ink-800 text-ink-50 transition-colors disabled:opacity-50">
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  Keyingi <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white border border-ink-200 rounded-2xl p-4 shadow-card mb-3">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-3">Jonli ko'rinish</p>
              <div className="aspect-[210/297] overflow-hidden rounded-lg border border-ink-100">
                <div className="scale-[0.48] origin-top-left w-[208.33%]" style={{ height: '208.33%' }}>
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAI && createdId && (
        <AiGenerateModal resumeId={createdId} onClose={() => setShowAI(false)} onSuccess={() => setShowAI(false)} />
      )}
    </DashboardLayout>
  );
}
