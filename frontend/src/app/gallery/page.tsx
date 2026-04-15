'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Eye, Globe, Search, Loader2, FileText } from 'lucide-react';
import { resumeApi } from '@/lib/queries';
import { formatDate, TEMPLATES } from '@/lib/utils';
import type { Resume } from '@/types';

const TEMPLATE_LABELS: Record<string, string> = {
  minimal: 'Minimal',
  professional: 'Professional',
  modern: 'Modern',
  creative: 'Creative',
  academic: 'Academic',
};

function ResumeCard({ resume }: { resume: Resume }) {
  const template = TEMPLATES.find(t => t.id === resume.template_id);
  const initials = resume.data?.personal?.fullName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '??';

  return (
    <Link
      href={`/public/${resume.slug}`}
      className="group bg-white rounded-2xl border border-ink-200 hover:border-ink-300
        shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden block"
    >
      {/* Color bar */}
      <div className="h-1.5 transition-all" style={{ background: template?.color || '#3a322d' }} />

      <div className="p-5">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: template?.color || '#3a322d' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-ink-900 truncate text-sm">
              {resume.data?.personal?.fullName || 'Noma\'lum'}
            </h3>
            <p className="text-xs text-ink-400 truncate">
              {resume.data?.personal?.city || ''}{resume.data?.experience?.[0]?.position
                ? ` · ${resume.data.experience[0].position}` : ''}
            </p>
          </div>
        </div>

        {/* Resume title */}
        <p className="text-xs font-medium text-ink-600 mb-3 truncate">{resume.title}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-xs bg-ink-100 text-ink-500 px-2 py-0.5 rounded-full">
            {TEMPLATE_LABELS[resume.template_id] || resume.template_id}
          </span>
          <span className="text-xs bg-ink-100 text-ink-500 px-2 py-0.5 rounded-full uppercase">
            {resume.language}
          </span>
          {resume.data?.skills?.slice(0, 2).map((s: string) => (
            <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
              {s}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-ink-400">
          <span className="flex items-center gap-1">
            <Eye size={11} /> {resume.view_count} ko'rish
          </span>
          <span className="text-ink-300">{formatDate(resume.created_at)}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="px-5 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          className="w-full text-center text-xs font-semibold py-2 rounded-lg text-white transition-colors"
          style={{ background: template?.color || '#3a322d' }}
        >
          Ko'rish →
        </div>
      </div>
    </Link>
  );
}

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('');

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: resumeApi.gallery,
  });

  const filtered = resumes.filter((r) => {
    const name = r.data?.personal?.fullName?.toLowerCase() || '';
    const title = r.title.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || title.includes(q);
    const matchTemplate = !filterTemplate || r.template_id === filterTemplate;
    return matchSearch && matchTemplate;
  });

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Hero */}
      <div className="bg-ink-950 pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe size={20} className="text-amber-400" />
            <span className="text-amber-400 text-sm font-medium uppercase tracking-widest">
              Ochiq Galeriya
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Ilhomlantiruvchi Rezumeler
          </h1>
          <p className="text-ink-400 text-sm max-w-md mx-auto">
            Foydalanuvchilar tomonidan yaratilgan va ommaga ochilgan professional rezumeler.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ism yoki sarlavha bo'yicha qidirish..."
              className="w-full bg-white border border-ink-200 rounded-xl pl-9 pr-4 py-2.5 text-sm
                text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-amber-400
                focus:ring-1 focus:ring-amber-400/30 transition-colors shadow-sm"
            />
          </div>

          {/* Template filter */}
          <select
            value={filterTemplate}
            onChange={e => setFilterTemplate(e.target.value)}
            className="bg-white border border-ink-200 rounded-xl px-4 py-2.5 text-sm text-ink-700
              focus:outline-none focus:border-amber-400 shadow-sm cursor-pointer"
          >
            <option value="">Barcha shablonlar</option>
            {Object.entries(TEMPLATE_LABELS).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-ink-400 text-sm">
            {isLoading ? '...' : `${filtered.length} ta rezume topildi`}
          </span>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-amber-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <FileText size={40} className="text-ink-300 mx-auto mb-4" />
            <p className="text-ink-400">Hech narsa topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(resume => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
