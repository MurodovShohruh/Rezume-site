import { create } from 'zustand';
import type { ResumeData, TemplateId, LanguageCode } from '@/types';

const defaultData: ResumeData = {
  personal: { fullName: '', email: '', phone: '', city: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
};

interface ResumeBuilderState {
  title: string;
  templateId: TemplateId;
  language: LanguageCode;
  data: ResumeData;
  currentStep: number;
  isDirty: boolean;

  setTitle: (title: string) => void;
  setTemplateId: (id: TemplateId) => void;
  setLanguage: (lang: LanguageCode) => void;
  setData: (data: Partial<ResumeData>) => void;
  setStep: (step: number) => void;
  reset: () => void;
  loadFromResume: (resume: { title: string; template_id: TemplateId; language: LanguageCode; data: ResumeData }) => void;
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  title: 'Mening Rezumem',
  templateId: 'minimal',
  language: 'uz',
  data: defaultData,
  currentStep: 0,
  isDirty: false,

  setTitle: (title) => set({ title, isDirty: true }),
  setTemplateId: (templateId) => set({ templateId, isDirty: true }),
  setLanguage: (language) => set({ language, isDirty: true }),
  setData: (partial) =>
    set((state) => ({ data: { ...state.data, ...partial }, isDirty: true })),
  setStep: (currentStep) => set({ currentStep }),
  reset: () => set({ title: 'Mening Rezumem', templateId: 'minimal', language: 'uz', data: defaultData, currentStep: 0, isDirty: false }),
  loadFromResume: (resume) =>
    set({ title: resume.title, templateId: resume.template_id, language: resume.language, data: resume.data, isDirty: false }),
}));
