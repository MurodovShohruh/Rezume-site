import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('uz-UZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatMonthYear(yyyyMM: string): string {
  const [year, month] = yyyyMM.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str;
}

export const TEMPLATES = [
  { id: 'minimal',      name: 'Minimal',      description: 'Sodda va toza dizayn',              color: '#3a322d' },
  { id: 'professional', name: 'Professional', description: 'Klassik ikki ustunli ko\'rinish',    color: '#1e2d40' },
  { id: 'modern',       name: 'Modern',       description: 'Zamonaviy rangli dizayn',            color: '#537553' },
  { id: 'creative',     name: 'Creative',     description: 'Dizayner va ijodkorlar uchun',        color: '#b45309' },
  { id: 'academic',     name: 'Academic',     description: 'Olimlar va tadqiqotchilar uchun',    color: '#5e3a8a' },
] as const;

export const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha",  flag: '🇺🇿' },
  { code: 'ru', label: 'Русский',    flag: '🇷🇺' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
] as const;

export const LEVEL_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'] as const;
