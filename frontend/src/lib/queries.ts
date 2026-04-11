import { api } from './api';
import type {
  AuthTokens, User, Resume, ResumeData, TemplateId, LanguageCode,
  PaginatedData, UserStats, AiContent, AtsResult
} from '@/types';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { email: string; full_name: string; password: string }) =>
    api.post<{ data: AuthTokens }>('/auth/register/', data).then(r => r.data.data),

  login: (data: { email: string; password: string }) =>
    api.post<{ data: AuthTokens }>('/auth/login/', data).then(r => r.data.data),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),

  me: () =>
    api.get<{ data: User }>('/auth/me/').then(r => r.data.data),

  updateProfile: (data: Partial<User>) =>
    api.patch<{ data: User }>('/auth/me/', data).then(r => r.data.data),
};

// ─── Resume ───────────────────────────────────────────────────────────────────

export const resumeApi = {
  list: () =>
    api.get<{ data: PaginatedData<Resume> }>('/resumes/').then(r => r.data.data.results),

  get: (id: string) =>
    api.get<{ data: Resume }>(`/resumes/${id}/`).then(r => r.data.data),

  create: (payload: { title: string; template_id: TemplateId; data: ResumeData; language: LanguageCode }) =>
    api.post<{ data: Resume }>('/resumes/', payload).then(r => r.data.data),

  update: (id: string, payload: Partial<{ title: string; template_id: TemplateId; data: ResumeData; language: LanguageCode; is_public: boolean }>) =>
    api.patch<{ data: Resume }>(`/resumes/${id}/`, payload).then(r => r.data.data),

  delete: (id: string) =>
    api.delete(`/resumes/${id}/`),

  exportPdf: (id: string) =>
    api.post<{ data: { pdf_url: string } }>(`/resumes/${id}/export-pdf/`).then(r => r.data.data),

  togglePublic: (id: string) =>
    api.patch<{ data: { is_public: boolean; slug: string; public_url: string } }>(`/resumes/${id}/toggle-public/`).then(r => r.data.data),

  getPublic: (slug: string) =>
    api.get<{ data: Resume }>(`/public/${slug}/`).then(r => r.data.data),

  gallery: () =>
    api.get<{ data: PaginatedData<Resume> }>('/gallery/').then(r => r.data.data.results),
};

// ─── AI ───────────────────────────────────────────────────────────────────────

export const aiApi = {
  generate: (id: string) =>
    api.post<{ data: { ai_content: AiContent } }>(`/ai/resumes/${id}/generate/`).then(r => r.data.data),

  coverLetter: (id: string, job_title: string, company_name: string) =>
    api.post<{ data: { cover_letter: string } }>(`/ai/resumes/${id}/cover-letter/`, { job_title, company_name }).then(r => r.data.data),

  atsAnalysis: (id: string, job_description?: string) =>
    api.post<{ data: AtsResult }>(`/ai/resumes/${id}/ats-analysis/`, { job_description }).then(r => r.data.data),
};

// ─── Statistics ───────────────────────────────────────────────────────────────

export const statsApi = {
  me: () =>
    api.get<{ data: UserStats }>('/statistics/me/').then(r => r.data.data),
};
