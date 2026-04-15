import { resumeApi } from '@/lib/queries';
import { TEMPLATES } from '@/lib/utils';
import { Eye, Globe, Download } from 'lucide-react';

export default async function PublicResumePage({ params }: { params: { slug: string } }) {
  let resume;
  try {
    resume = await resumeApi.getPublic(params.slug);
  } catch {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-4xl font-bold text-ink-300 mb-3">404</p>
          <p className="text-ink-500">Bu rezume topilmadi yoki yopiq.</p>
        </div>
      </div>
    );
  }

  const data = resume.data;
  const ai = resume.ai_content;
  const template = TEMPLATES.find(t => t.id === resume.template_id);
  const summary = ai?.summary || data.personal?.summary;

  return (
    <div className="min-h-screen bg-ink-100">
      {/* Top bar */}
      <div className="bg-ink-950 text-ink-400 text-xs py-2 px-6 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-amber-400 font-semibold text-sm">
          <Globe size={14} /> ResumeAI
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye size={12} /> {resume.view_count} ko'rish
          </span>
          {resume.pdf_url && (
            <a href={resume.pdf_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors">
              <Download size={12} /> PDF
            </a>
          )}
        </div>
      </div>

      {/* Resume */}
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white shadow-card-hover rounded-3xl overflow-hidden">
          {/* Color bar */}
          <div className="h-2.5" style={{ background: template?.color || '#3a322d' }} />

          <div className="p-10">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-ink-100">
              <h1 className="font-display text-4xl font-bold text-ink-950 mb-3">
                {data.personal?.fullName}
              </h1>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-ink-500 text-sm">
                {data.personal?.email && <a href={`mailto:${data.personal.email}`} className="hover:text-amber-600 transition-colors">{data.personal.email}</a>}
                {data.personal?.phone && <span>{data.personal.phone}</span>}
                {data.personal?.city && <span>{data.personal.city}</span>}
                {data.personal?.linkedin && <a href={data.personal.linkedin} target="_blank" rel="noreferrer" className="hover:text-amber-600 transition-colors">LinkedIn</a>}
                {data.personal?.github && <a href={data.personal.github} target="_blank" rel="noreferrer" className="hover:text-amber-600 transition-colors">GitHub</a>}
              </div>
              {summary && (
                <p className="mt-4 text-ink-600 leading-relaxed text-sm border-l-3 border-amber-400 pl-4">
                  {summary}
                </p>
              )}
            </div>

            {/* Experience */}
            {(data.experience?.length ?? 0) > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-ink-400 mb-4">
                  Ish Tajribasi
                </h2>
                <div className="space-y-5">
                  {data.experience!.map((exp, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-0.5 bg-ink-100 rounded-full flex-shrink-0 mt-1.5" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0.5">
                          <h3 className="font-semibold text-ink-900">{exp.position}</h3>
                          <span className="text-xs text-ink-400">
                            {exp.startDate} – {exp.isCurrent ? 'Hozir' : exp.endDate}
                          </span>
                        </div>
                        <p className="text-ink-500 text-sm mb-2">{exp.company}</p>
                        {exp.description && (
                          <p className="text-ink-600 text-sm leading-relaxed">{
                            ai?.experience?.[i]?.description || exp.description
                          }</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {(data.education?.length ?? 0) > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-ink-400 mb-4">Ta'lim</h2>
                <div className="space-y-3">
                  {data.education!.map((edu, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <p className="font-semibold text-ink-900">{edu.institution}</p>
                        <p className="text-ink-500 text-sm">{edu.degree}, {edu.field}</p>
                      </div>
                      <span className="text-sm text-ink-400">{edu.startYear}–{edu.endYear ?? 'Hozir'}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {(data.skills?.length ?? 0) > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-ink-400 mb-4">Ko'nikmalar</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills!.map((s, i) => (
                    <span key={i} className="bg-ink-100 text-ink-700 text-sm px-3 py-1.5 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages & Certs */}
            <div className="grid grid-cols-2 gap-8">
              {(data.languages?.length ?? 0) > 0 && (
                <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.15em] text-ink-400 mb-3">Tillar</h2>
                  <div className="space-y-1.5">
                    {data.languages!.map((l, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-ink-700">{l.name}</span>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {(data.certificates?.length ?? 0) > 0 && (
                <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.15em] text-ink-400 mb-3">Sertifikatlar</h2>
                  <div className="space-y-2">
                    {data.certificates!.map((c, i) => (
                      <div key={i}>
                        <p className="text-sm font-medium text-ink-700">{c.name}</p>
                        <p className="text-xs text-ink-400">{c.issuer} · {c.date}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-ink-400 text-xs mt-6">
          <a href="/" className="hover:text-amber-600 font-medium transition-colors">ResumeAI</a> orqali yaratilgan
        </p>
      </div>
    </div>
  );
}
