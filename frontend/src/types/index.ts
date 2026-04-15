// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

// ─── Resume ───────────────────────────────────────────────────────────────────

export type LanguageCode = 'uz' | 'ru' | 'en';
export type TemplateId = 'minimal' | 'professional' | 'modern' | 'creative' | 'academic';
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  summary?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number | null;
}

export interface Language {
  name: string;
  level: LanguageLevel;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certificates: Certificate[];
}

export interface Resume {
  id: string;
  title: string;
  template_id: TemplateId;
  data: ResumeData;
  ai_content?: {
    summary?: string;
    experience?: { index: number; description: string }[];
  } | null;
  language: LanguageCode;
  is_public: boolean;
  slug?: string | null;
  pdf_url?: string | null;
  view_count: number;
  owner?: { id: string; full_name: string };
  created_at: string;
  updated_at: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export interface ResumeStats {
  resume_id: string;
  title: string;
  view_count: number;
  pdf_download_count: number;
  is_public: boolean;
  created_at: string;
}

export interface UserStats {
  total_resumes: number;
  public_resumes: number;
  total_views: number;
  total_pdf_downloads: number;
  resumes: ResumeStats[];
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface AiContent {
  summary?: string;
  experience?: { index: number; description: string }[];
}

export interface AtsResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  suggestions: string[];
}

// ─── Templates ───────────────────────────────────────────────────────────────

export interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  previewColor: string;
}
