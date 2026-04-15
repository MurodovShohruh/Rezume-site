'use client';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { statsApi } from '@/lib/queries';
import { Eye, Download, FileText, Globe, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StatsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.me,
  });

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink-900">Statistika</h1>
          <p className="text-ink-500 text-sm mt-1">Rezumelaring ko'rsatkichlari</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-ink-200 p-5 h-24 skeleton" />
            ))}
          </div>
        ) : stats && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger">
              {[
                { label: 'Jami rezumeler', value: stats.total_resumes, icon: <FileText size={20} className="text-amber-500" />, bg: 'bg-amber-50' },
                { label: 'Ochiq rezumeler', value: stats.public_resumes, icon: <Globe size={20} className="text-sage-500" />, bg: 'bg-sage-50' },
                { label: 'Jami ko\'rishlar', value: stats.total_views, icon: <Eye size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
                { label: 'PDF yuklashlar', value: stats.total_pdf_downloads, icon: <Download size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
              ].map(({ label, value, icon, bg }) => (
                <div key={label} className="bg-white border border-ink-200 rounded-2xl p-5 shadow-card">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    {icon}
                  </div>
                  <p className="font-display text-3xl font-bold text-ink-900">{value}</p>
                  <p className="text-ink-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Per-resume table */}
            {stats.resumes.length > 0 && (
              <div className="bg-white border border-ink-200 rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-ink-100 flex items-center gap-2">
                  <TrendingUp size={16} className="text-ink-400" />
                  <h2 className="font-semibold text-ink-800 text-sm">Rezume bo'yicha</h2>
                </div>
                <div className="divide-y divide-ink-50">
                  {stats.resumes.map((r) => (
                    <div key={r.resume_id} className="flex items-center gap-4 px-6 py-4 hover:bg-ink-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink-800 text-sm truncate">{r.title}</p>
                        <p className="text-ink-400 text-xs">{formatDate(r.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-ink-500">
                        <span className="flex items-center gap-1">
                          <Eye size={13} /> {r.view_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download size={13} /> {r.pdf_download_count}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                          ${r.is_public ? 'bg-sage-50 text-sage-700' : 'bg-ink-100 text-ink-500'}`}>
                          {r.is_public ? '🌐 Ochiq' : '🔒 Yopiq'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
