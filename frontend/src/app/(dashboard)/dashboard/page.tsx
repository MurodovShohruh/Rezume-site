'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Plus, FileText, Eye, Download, Globe, Lock,
  MoreVertical, Trash2, Pencil, Copy, BarChart2,
  Loader2, Sparkles
} from 'lucide-react';
import { resumeApi } from '@/lib/queries';
import { useAuthStore } from '@/store/auth.store';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { formatDate, TEMPLATES } from '@/lib/utils';
import { getErrorMessage } from '@/lib/api';
import { useState } from 'react';
import type { Resume } from '@/types';

function ResumeCard({ resume, onDelete, onTogglePublic }:
  { resume: Resume; onDelete: (id: string) => void; onTogglePublic: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const template = TEMPLATES.find(t => t.id === resume.template_id);

  return (
    <div className="group bg-white rounded-2xl border border-ink-200 hover:border-ink-300
      shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">

      {/* Color bar */}
      <div className="h-1.5" style={{ background: template?.color || '#3a322d' }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="font-semibold text-ink-900 truncate">{resume.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-ink-400 font-medium bg-ink-100 px-2 py-0.5 rounded-full">
                {template?.name}
              </span>
              <span className="text-xs text-ink-400 uppercase tracking-wide">{resume.language}</span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400
                hover:text-ink-700 hover:bg-ink-100 transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-9 z-20 bg-white border border-ink-200 rounded-xl
                  shadow-card-hover py-1 w-44 animate-fade-in">
                  <Link href={`/resume/${resume.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                    <Pencil size={14} /> Tahrirlash
                  </Link>
                  <button onClick={() => { onTogglePublic(resume.id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                    {resume.is_public ? <Lock size={14} /> : <Globe size={14} />}
                    {resume.is_public ? 'Private qilish' : 'Public qilish'}
                  </button>
                  <hr className="border-ink-100 my-1" />
                  <button onClick={() => { onDelete(resume.id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} /> O'chirish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-ink-400 mb-4">
          <span className="flex items-center gap-1">
            <Eye size={12} /> {resume.view_count}
          </span>
          {resume.pdf_url && (
            <span className="flex items-center gap-1">
              <Download size={12} /> PDF
            </span>
          )}
          <span className="ml-auto">{formatDate(resume.updated_at)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/resume/${resume.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-ink-950 hover:bg-ink-800
              text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            <Pencil size={12} /> Tahrirlash
          </Link>

          {resume.is_public ? (
            <span className="flex items-center gap-1 text-xs text-sage-600 bg-sage-50 px-3 py-2 rounded-lg font-medium">
              <Globe size={12} /> Ochiq
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-ink-400 bg-ink-100 px-3 py-2 rounded-lg font-medium">
              <Lock size={12} /> Yopiq
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: resumeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Rezume o\'chirildi');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const togglePublicMutation = useMutation({
    mutationFn: resumeApi.togglePublic,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success(data.is_public ? 'Rezume public qilindi 🌐' : 'Rezume private qilindi 🔒');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Xayrli tong' : hour < 17 ? 'Xayrli kun' : 'Xayrli kech';

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 stagger">
          <div>
            <p className="text-ink-400 text-sm mb-1">{greeting},</p>
            <h1 className="font-display text-3xl font-bold text-ink-900">
              {user?.full_name?.split(' ')[0]} 👋
            </h1>
          </div>
          <Link href="/resume/new"
            className="flex items-center gap-2 bg-ink-950 hover:bg-ink-800 text-white
              font-semibold px-5 py-3 rounded-xl transition-colors shadow-card text-sm">
            <Plus size={17} /> Yangi Rezume
          </Link>
        </div>

        {/* Stats row */}
        {resumes.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Jami rezumeler', value: resumes.length, icon: <FileText size={18} className="text-amber-500" /> },
              { label: 'Ochiq rezumeler', value: resumes.filter(r => r.is_public).length, icon: <Globe size={18} className="text-sage-500" /> },
              { label: 'Jami ko\'rishlar', value: resumes.reduce((s, r) => s + r.view_count, 0), icon: <Eye size={18} className="text-amber-500" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white border border-ink-200 rounded-2xl p-5 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-ink-500 text-sm">{label}</span>
                  {icon}
                </div>
                <p className="font-display text-3xl font-bold text-ink-900">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Resume grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-ink-200 p-5 h-44">
                <div className="skeleton h-4 w-2/3 mb-3 rounded" />
                <div className="skeleton h-3 w-1/3 mb-6 rounded" />
                <div className="skeleton h-3 w-full mb-2 rounded" />
                <div className="skeleton h-8 w-full rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-6">
              <Sparkles size={36} className="text-amber-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink-800 mb-3">
              Birinchi rezumengiz
            </h2>
            <p className="text-ink-400 mb-8 max-w-sm">
              AI yordamida professional rezume yarating. Bor yo'g'i 10 daqiqa ketadi.
            </p>
            <Link href="/resume/new"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-ink-950
                font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-amber-200">
              <Plus size={18} /> Rezume Yaratish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={(id) => deleteMutation.mutate(id)}
                onTogglePublic={(id) => togglePublicMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
