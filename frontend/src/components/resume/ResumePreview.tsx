'use client';
import { useResumeBuilderStore } from '@/store/resume.store';
import { TEMPLATES, cn } from '@/lib/utils';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-[8px] uppercase tracking-widest font-bold text-ink-400 border-b border-ink-200 pb-1 mb-2">{title}</h3>
      {children}
    </div>
  );
}

export function ResumePreview() {
  const { data, templateId } = useResumeBuilderStore();
  const template = TEMPLATES.find(t => t.id === templateId);
  const { personal, experience, education, skills, languages } = data;

  const isProfessional = templateId === 'professional';

  if (isProfessional) {
    return (
      <div className="bg-white rounded-lg shadow-card overflow-hidden text-[9px] leading-relaxed h-full">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-28 flex-shrink-0 text-white p-3" style={{ background: template?.color }}>
            <div className="font-bold text-[10px] leading-tight mb-0.5">{personal.fullName || 'Ism Familiya'}</div>
            {experience[0] && <div className="text-[8px] opacity-70 mb-3">{experience[0].position}</div>}
            <div className="text-[7px] uppercase tracking-wider opacity-60 mb-1">Aloqa</div>
            {personal.email && <div className="opacity-80 break-all">{personal.email}</div>}
            {personal.phone && <div className="opacity-80">{personal.phone}</div>}
            {personal.city && <div className="opacity-80">{personal.city}</div>}
            {skills.length > 0 && <>
              <div className="text-[7px] uppercase tracking-wider opacity-60 mt-3 mb-1">Ko'nikmalar</div>
              {skills.slice(0, 5).map((s, i) => (
                <div key={i} className="opacity-80 mb-0.5">{s}</div>
              ))}
            </>}
            {languages.length > 0 && <>
              <div className="text-[7px] uppercase tracking-wider opacity-60 mt-3 mb-1">Tillar</div>
              {languages.map((l, i) => (
                <div key={i} className="opacity-80">{l.name} ({l.level})</div>
              ))}
            </>}
          </div>
          {/* Main */}
          <div className="flex-1 p-3">
            {personal.summary && <Section title="Qisqacha"><p className="text-ink-600">{personal.summary}</p></Section>}
            {experience.length > 0 && (
              <Section title="Ish Tajribasi">
                {experience.slice(0, 2).map((e, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-ink-800">{e.position}</span>
                      <span className="text-ink-400 text-[7px]">{e.startDate}–{e.isCurrent ? 'Hozir' : e.endDate}</span>
                    </div>
                    <div className="text-ink-500">{e.company}</div>
                    {e.description && <div className="text-ink-400 mt-0.5">{e.description.slice(0, 80)}…</div>}
                  </div>
                ))}
              </Section>
            )}
            {education.length > 0 && (
              <Section title="Ta'lim">
                {education.slice(0, 2).map((e, i) => (
                  <div key={i} className="mb-1">
                    <span className="font-semibold text-ink-800">{e.institution}</span>
                    <div className="text-ink-500">{e.degree}, {e.field}</div>
                  </div>
                ))}
              </Section>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card p-5 text-[9px] leading-relaxed h-full">
      {/* Header */}
      <div className="mb-4 pb-3 border-b-2" style={{ borderColor: template?.color }}>
        <div className="font-bold text-[14px] text-ink-900 leading-tight">
          {personal.fullName || 'Ism Familiya'}
        </div>
        <div className="text-ink-500 mt-0.5 flex flex-wrap gap-x-2">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.city && <span>· {personal.city}</span>}
        </div>
      </div>

      {personal.summary && (
        <Section title="Qisqacha">
          <p className="text-ink-600">{personal.summary.slice(0, 120)}{personal.summary.length > 120 ? '…' : ''}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Ish Tajribasi">
          {experience.slice(0, 2).map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold text-ink-800">{e.position}</span>
                <span className="text-ink-400 text-[7px]">{e.startDate}–{e.isCurrent ? 'Hozir' : e.endDate}</span>
              </div>
              <div className="text-ink-500">{e.company}</div>
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Ta'lim">
          {education.slice(0, 1).map((e, i) => (
            <div key={i}>
              <span className="font-semibold text-ink-800">{e.institution}</span>
              <div className="text-ink-500">{e.degree}</div>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Ko'nikmalar">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 8).map((s, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-[8px] font-medium"
                style={{ background: template?.color + '18', color: template?.color }}>
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
