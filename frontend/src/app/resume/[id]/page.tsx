'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Download, Globe, Lock, Sparkles, ArrowLeft, Loader2,
  Eye, Copy, Check, Trash2, ExternalLink, BarChart2, FileText
} from 'lucide-react';
import { resumeApi, aiApi } from '@/lib/queries';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AiGenerateModal } from '@/components/ai/AiGenerateModal';
import { CoverLetterModal } from '@/components/resume/CoverLetterModal';
import { ATSModal } from '@/components/resume/ATSModal';
import { TEMPLATES, LANGUAGES, formatDate, cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/api';

function ResumePreview({ resume }: { resume: import('@/types').Resume }) {
  const data = resume.data;
  const ai = resume.ai_content;
  const template = TEMPLATES.find(t => t.id === resume.template_id);

  const summary = ai?.summary || data.personal?.summary;
  const experiences = data.experience?.map((exp, i) => ({
    ...exp,
    description: ai?.experience?.[i]?.description || exp.description,
  })) || [];

  return (
    <div className="bg-white rounded-2xl border border-ink-200 shadow-card overflow-hidden text-sm">
      {/* Color accent */}
      <div className="h-2" style={{ background: template?.color || '#3a322d' }} />

      <div className="p-8 font-body">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-ink-900">
            {data.personal?.fullName || 'Ismingiz'}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-ink-500 text-xs">
            {data.personal?.email && <span>{data.personal.email}</span>}
            {data.personal?.phone && <span>{data.personal.phone}</span>}
            {data.personal?.city && <span>{data.personal.city}</span>}
          </div>
          {summary && (
            <p className="mt-3 text-ink-600 text-sm leading-relaxed border-l-2 border-amber-300 pl-3">
              {summary}
            </p>
          )}
        </div>

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3
              border-b border-ink-100 pb-1">Ish Tajribasi</h2>
            <div className="space-y-3">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-ink-800">{exp.position}</span>
                    <span className="text-xs text-ink-400">
                      {exp.startDate} – {exp.isCurrent ? 'Hozir' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-ink-500 text-xs mb-1">{exp.company}</p>
                  {exp.description && <p className="text-ink-600 text-xs leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {(data.education?.length ?? 0) > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3
              border-b border-ink-100 pb-1">Ta'lim</h2>
            <div className="space-y-2">
              {data.education!.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-ink-800 text-xs">{edu.institution}</span>
                    <p className="text-ink-500 text-xs">{edu.degree}, {edu.field}</p>
                  </div>
                  <span className="text-xs text-ink-400">{edu.startYear}–{edu.endYear ?? 'Hozir'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {(data.skills?.length ?? 0) > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3
              border-b border-ink-100 pb-1">Ko'nikmalar</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills!.map((s, i) => (
                <span key={i} className="bg-ink-100 text-ink-700 text-xs px-2.5 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {(data.languages?.length ?? 0) > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3
              border-b border-ink-100 pb-1">Tillar</h2>
            <div className="flex flex-wrap gap-3">
              {data.languages!.map((l, i) => (
                <span key={i} className="text-xs text-ink-600">
                  {l.name} <span className="text-amber-600 font-semibold">{l.level}</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAI, setShowAI] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showATS, setShowATS] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordLoading, setWordLoading] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeApi.get(id),
  });

  const exportPdfMutation = useMutation({
    mutationFn: () => resumeApi.exportPdf(id),
    onSuccess: (data) => {
      window.open(data.pdf_url, '_blank');
      toast.success('PDF tayyor! ✅');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleWordExport = async () => {
    setWordLoading(true);
    try {
      const response = await api.post(`/resumes/${id}/export-word/`, {}, { responseType: 'blob' });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${id}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Word fayl yuklandi! 📄');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setWordLoading(false);
    }
  };

  const togglePublicMutation = useMutation({
    mutationFn: () => resumeApi.togglePublic(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      toast.success(data.is_public ? 'Rezume public qilindi 🌐' : 'Rezume private qilindi 🔒');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => resumeApi.delete(id),
    onSuccess: () => {
      toast.success('Rezume o\'chirildi');
      router.push('/dashboard');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const copyPublicUrl = () => {
    if (!resume?.slug) return;
    const url = `${window.location.origin}/public/${resume.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Havola nusxalandi!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 size={32} className="animate-spin text-amber-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!resume) return null;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-ink-50 p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.push('/dashboard')}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-ink-200
                text-ink-500 hover:text-ink-800 hover:bg-white hover:shadow-card transition-all">
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-ink-900">{resume.title}</h1>
              <p className="text-ink-400 text-sm mt-0.5">
                Yangilangan: {formatDate(resume.updated_at)} ·{' '}
                <span className="flex items-center gap-1 inline-flex">
                  <Eye size={12} /> {resume.view_count} ko'rish
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-ink-700 text-sm">Ko'rinish</h2>
                {resume.ai_content && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50
                    border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                    <Sparkles size={11} /> AI yaxshilangan
                  </span>
                )}
              </div>
              <ResumePreview resume={resume} />
            </div>

            {/* Actions sidebar */}
            <div className="space-y-3">

              {/* AI */}
              <button onClick={() => setShowAI(true)}
                className="w-full flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600
                  hover:from-amber-400 hover:to-amber-500 text-ink-950 font-semibold
                  px-5 py-4 rounded-2xl transition-all shadow-lg shadow-amber-200 group">
                <div className="w-9 h-9 bg-white/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">AI bilan yaxshilash</p>
                  <p className="text-xs opacity-80">Professional matn generatsiya</p>
                </div>
              </button>

              {/* PDF */}
              <button onClick={() => exportPdfMutation.mutate()}
                disabled={exportPdfMutation.isPending}
                className="w-full flex items-center gap-3 bg-white border border-ink-200
                  hover:border-ink-300 hover:shadow-card text-ink-800 font-medium
                  px-5 py-3.5 rounded-2xl transition-all text-sm disabled:opacity-60">
                {exportPdfMutation.isPending
                  ? <Loader2 size={17} className="animate-spin text-ink-400" />
                  : <Download size={17} className="text-ink-500" />
                }
                PDF yuklab olish
              </button>

              {/* Word Export — V2 */}
              <button onClick={handleWordExport}
                disabled={wordLoading}
                className="w-full flex items-center gap-3 bg-white border border-blue-200
                  hover:border-blue-300 hover:shadow-card text-blue-700 font-medium
                  px-5 py-3.5 rounded-2xl transition-all text-sm disabled:opacity-60">
                {wordLoading
                  ? <Loader2 size={17} className="animate-spin text-blue-400" />
                  : <FileText size={17} className="text-blue-400" />
                }
                Word (.docx) yuklab olish
              </button>

              {/* Cover Letter — V2 */}
              <button onClick={() => setShowCoverLetter(true)}
                className="w-full flex items-center gap-3 bg-white border border-purple-200
                  hover:border-purple-300 hover:shadow-card text-purple-700 font-medium
                  px-5 py-3.5 rounded-2xl transition-all text-sm">
                <Sparkles size={17} className="text-purple-400" />
                Motivatsion xat
              </button>

              {/* ATS Score — V2 */}
              <button onClick={() => setShowATS(true)}
                className="w-full flex items-center gap-3 bg-white border border-ink-200
                  hover:border-ink-300 hover:shadow-card text-ink-700 font-medium
                  px-5 py-3.5 rounded-2xl transition-all text-sm">
                <BarChart2 size={17} className="text-ink-400" />
                ATS Ball tekshirish
              </button>

              {/* Public toggle */}
              <button onClick={() => togglePublicMutation.mutate()}
                disabled={togglePublicMutation.isPending}
                className={cn(
                  'w-full flex items-center gap-3 border font-medium px-5 py-3.5 rounded-2xl transition-all text-sm',
                  resume.is_public
                    ? 'bg-sage-50 border-sage-200 text-sage-800 hover:bg-sage-100'
                    : 'bg-white border-ink-200 text-ink-700 hover:border-ink-300',
                )}>
                {resume.is_public
                  ? <><Globe size={17} className="text-sage-500" /> Ochiq (private qilish)</>
                  : <><Lock size={17} className="text-ink-400" /> Yopiq (public qilish)</>
                }
              </button>

              {/* Copy public link */}
              {resume.is_public && resume.slug && (
                <button onClick={copyPublicUrl}
                  className="w-full flex items-center gap-3 bg-white border border-ink-200
                    hover:border-ink-300 text-ink-700 font-medium px-5 py-3.5 rounded-2xl
                    transition-all text-sm">
                  {copied ? <Check size={17} className="text-sage-500" /> : <Copy size={17} className="text-ink-400" />}
                  Havolani nusxalash
                </button>
              )}

              {/* View public */}
              {resume.is_public && resume.slug && (
                <a href={`/public/${resume.slug}`} target="_blank" rel="noreferrer"
                  className="w-full flex items-center gap-3 bg-white border border-ink-200
                    hover:border-ink-300 text-ink-700 font-medium px-5 py-3.5 rounded-2xl
                    transition-all text-sm">
                  <ExternalLink size={17} className="text-ink-400" />
                  Public ko'rinishda ochish
                </a>
              )}

              {/* Delete */}
              <div className="pt-2 border-t border-ink-100">
                <button
                  onClick={() => { if (confirm('Rezumeni o\'chirishni tasdiqlaysizmi?')) deleteMutation.mutate(); }}
                  className="w-full flex items-center gap-3 text-red-500 hover:text-red-700
                    hover:bg-red-50 font-medium px-5 py-3 rounded-2xl transition-all text-sm">
                  <Trash2 size={16} /> Rezumeni o'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAI && <AiGenerateModal resumeId={id} onClose={() => setShowAI(false)} />}
      {showCoverLetter && resume && (
        <CoverLetterModal
          resumeId={id}
          resumeTitle={resume.title}
          onClose={() => setShowCoverLetter(false)}
        />
      )}
      {showATS && resume && (
        <ATSModal
          resumeId={id}
          resumeTitle={resume.title}
          onClose={() => setShowATS(false)}
        />
      )}
    </DashboardLayout>
  );
}
