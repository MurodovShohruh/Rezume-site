'use client';
import { useState, KeyboardEvent } from 'react';
import { Plus, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useResumeBuilderStore } from '@/store/resume.store';
import { LEVEL_OPTIONS } from '@/lib/utils';
import type { Language, Certificate } from '@/types';

export function SkillsStep() {
  const { data, setData, setStep } = useResumeBuilderStore();
  const [skills, setSkills] = useState<string[]>(data.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [languages, setLanguages] = useState<Language[]>(data.languages || []);
  const [langName, setLangName] = useState('');
  const [langLevel, setLangLevel] = useState<Language['level']>('B2');
  const [certs, setCerts] = useState<Certificate[]>(data.certificates || []);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', date: '' });

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) {
      setSkills(prev => [...prev, v]);
    }
    setSkillInput('');
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
  };

  const addLang = () => {
    if (!langName.trim()) return;
    setLanguages(prev => [...prev, { name: langName.trim(), level: langLevel }]);
    setLangName('');
    setLangLevel('B2');
  };

  const addCert = () => {
    if (!certForm.name) return;
    setCerts(prev => [...prev, certForm]);
    setCertForm({ name: '', issuer: '', date: '' });
  };

  const onNext = () => {
    setData({ skills, languages, certificates: certs });
    setStep(4);
  };

  const inputCls = `border border-ink-200 bg-white text-ink-900 placeholder:text-ink-300
    rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400
    focus:ring-2 focus:ring-amber-100 transition-all`;

  return (
    <div className="space-y-8">

      {/* Skills */}
      <section>
        <h3 className="font-semibold text-ink-800 mb-3">Texnik ko'nikmalar</h3>
        <div className="flex gap-2 mb-3">
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Python, Django, Docker... (Enter bosing)"
            className={`flex-1 ${inputCls}`}
          />
          <button onClick={addSkill} type="button"
            className="flex items-center gap-1 bg-ink-900 hover:bg-ink-700 text-white
              px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus size={15} />
          </button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-ink-100 text-ink-700
                text-sm px-3 py-1.5 rounded-full font-medium">
                {s}
                <button onClick={() => setSkills(prev => prev.filter((_, j) => j !== i))}
                  className="text-ink-400 hover:text-red-500 transition-colors">
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
        {/* Suggestions */}
        <p className="text-xs text-ink-400 mt-2">Mashhur:</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {['JavaScript', 'Python', 'React', 'Node.js', 'Django', 'SQL', 'Docker', 'Git', 'TypeScript', 'Figma'].map(s => (
            <button key={s} type="button"
              onClick={() => !skills.includes(s) && setSkills(prev => [...prev, s])}
              className="text-xs border border-ink-200 text-ink-500 hover:border-amber-300
                hover:text-amber-700 px-2.5 py-1 rounded-full transition-colors
                disabled:opacity-40 disabled:pointer-events-none"
              disabled={skills.includes(s)}>
              + {s}
            </button>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section>
        <h3 className="font-semibold text-ink-800 mb-3">Chet tillari</h3>
        {languages.map((l, i) => (
          <div key={i} className="flex items-center justify-between bg-white border border-ink-200
            rounded-xl px-4 py-2.5 mb-2 text-sm">
            <span className="font-medium text-ink-800">{l.name}</span>
            <div className="flex items-center gap-3">
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold">{l.level}</span>
              <button onClick={() => setLanguages(prev => prev.filter((_, j) => j !== i))}
                className="text-ink-300 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <input value={langName} onChange={e => setLangName(e.target.value)}
            placeholder="Inglizcha, Ruscha..." className={`flex-1 ${inputCls}`} />
          <select value={langLevel} onChange={e => setLangLevel(e.target.value as Language['level'])}
            className={`${inputCls} w-24`}>
            {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <button onClick={addLang} type="button"
            className="bg-ink-900 hover:bg-ink-700 text-white px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} />
          </button>
        </div>
      </section>

      {/* Certificates */}
      <section>
        <h3 className="font-semibold text-ink-800 mb-3">
          Sertifikatlar <span className="text-xs text-ink-400 font-normal">(ixtiyoriy)</span>
        </h3>
        {certs.map((c, i) => (
          <div key={i} className="flex items-center justify-between bg-white border border-ink-200
            rounded-xl px-4 py-2.5 mb-2 text-sm">
            <div>
              <p className="font-medium text-ink-800">{c.name}</p>
              <p className="text-xs text-ink-400">{c.issuer} · {c.date}</p>
            </div>
            <button onClick={() => setCerts(prev => prev.filter((_, j) => j !== i))}
              className="text-ink-300 hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-2">
          <input value={certForm.name} onChange={e => setCertForm(p => ({...p, name: e.target.value}))}
            placeholder="AWS Certified Developer" className={`col-span-3 ${inputCls}`} />
          <input value={certForm.issuer} onChange={e => setCertForm(p => ({...p, issuer: e.target.value}))}
            placeholder="Amazon" className={`col-span-2 ${inputCls}`} />
          <input value={certForm.date} onChange={e => setCertForm(p => ({...p, date: e.target.value}))}
            placeholder="2023-05" className={inputCls} />
          <button onClick={addCert} type="button"
            className="col-span-3 flex items-center justify-center gap-1.5 border border-dashed
              border-ink-300 hover:border-amber-400 text-ink-400 hover:text-amber-600
              rounded-xl py-2.5 text-sm transition-colors">
            <Plus size={15} /> Sertifikat qo'shish
          </button>
        </div>
      </section>

      <div className="flex justify-between pt-2">
        <button onClick={() => setStep(2)}
          className="flex items-center gap-2 text-ink-500 hover:text-ink-700 font-medium text-sm transition-colors">
          <ArrowLeft size={16} /> Orqaga
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-ink-950
            font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
          Shablon tanlash <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
