'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles, FileText, Download, Globe, BarChart2, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ── Count-up hook ─────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let start: number | null = null;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* ── Brands data ───────────────────────────────────────────────────────── */
const BRANDS = [
  { name: 'Yandex',    icon: '🅨' },
  { name: 'Google',    icon: '🅖' },
  { name: 'EPAM',      icon: '⬡' },
  { name: 'Uzum',      icon: '🍇' },
  { name: 'Click',     icon: '◎' },
  { name: 'Payme',     icon: '◈' },
  { name: 'Beeline',   icon: '🐝' },
  { name: 'Ucell',     icon: '◉' },
  { name: 'Microsoft', icon: '⊞' },
  { name: 'Samsung',   icon: '◐' },
  { name: 'Huawei',    icon: '◑' },
  { name: 'Alif',      icon: '∆' },
];

/* ── Stats data ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: 12400, label: "Yaratilgan rezumeler",   suffix: "+" },
  { value: 96,    label: "Ish topgan foydalanuvchilar", suffix: "%" },
  { value: 5,     label: "Ta professional shablon", suffix: "" },
  { value: 3,     label: "Tilda rezume yaratasiz",  suffix: "" },
];

function StatCard({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center px-6 py-2 relative">
      <div className="flex items-start justify-center gap-0.5 mb-2">
        <span className="text-amber-400 font-bold text-2xl mt-1">+</span>
        <span className="font-display text-6xl md:text-7xl font-extrabold text-white leading-none tracking-tight">
          {count.toLocaleString()}
        </span>
        <span className="text-amber-400 font-bold text-2xl mt-1">{suffix}</span>
      </div>
      <p className="text-ink-400 text-sm font-medium tracking-wide">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-ink-50 overflow-hidden">

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-ink-800/60 backdrop-blur-md bg-ink-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="32" height="38" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="0" width="44" height="56" rx="6" fill="#f59e0b"/>
              <polygon points="34,0 48,0 48,14" fill="#b45309"/>
              <polygon points="34,0 34,14 48,14" fill="#d97706"/>
              <text x="9" y="43" fontFamily="Georgia,serif" fontSize="34" fontWeight="700" fill="#1e1a17">R</text>
              <circle cx="54" cy="50" r="10" fill="#1e1a17"/>
              <text x="54" y="55" fontFamily="Georgia,serif" fontSize="12" fontWeight="700" fill="#f59e0b" textAnchor="middle">AI</text>
            </svg>
            <span className="font-display text-xl font-semibold text-amber-400 tracking-tight">
              Resume<span className="text-ink-200">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-ink-300 hover:text-ink-50 text-sm font-medium transition-colors px-4 py-2">
              Kirish
            </Link>
            <Link href="/register"
              className="bg-amber-500 hover:bg-amber-400 text-ink-950 text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
              Boshlash
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sage-600/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#f7f6f3 1px, transparent 1px), linear-gradient(90deg, #f7f6f3 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm px-4 py-2 rounded-full mb-8 font-medium">
            <Sparkles size={14} />
            Claude AI bilan ishlaydi
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            Professional<br />
            <span className="text-amber-400">Rezume</span> yarating{' '}
            <span className="italic font-normal text-ink-400">10 daqiqada</span>
          </h1>

          <p className="text-ink-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Ma'lumotlaringizni kiriting — AI avtomatik ravishda professional matn yozadi,
            shablon tanlang va PDF yuklab oling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"
              className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-ink-950 font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40">
              Bepul Boshlash
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/gallery"
              className="flex items-center gap-2 border border-ink-700 hover:border-ink-500 text-ink-300 hover:text-ink-100 font-medium px-8 py-4 rounded-xl text-lg transition-colors">
              Namunalarni ko'rish
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS — foydalanuvchilar raqamlari ────────────────────────── */}
      <section className="py-20 bg-ink-950 border-y border-ink-800/60">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-ink-500 text-sm font-medium uppercase tracking-widest mb-14">
            Foydalanuvchilarimiz rezumelari
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={i} className="relative">
                {/* Divider */}
                {i > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-ink-700/60 hidden md:block" />
                )}
                <StatCard value={s.value} label={s.label} suffix={s.suffix} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS — aylanib turuvchi marquee ───────────────────────── */}
      <section className="py-16 bg-ink-900/40 overflow-hidden border-b border-ink-800/40">
        <p className="text-center text-ink-500 text-xs font-medium uppercase tracking-[0.2em] mb-10">
          Hamkorlar va foydalanuvchilar ishlayotgan kompaniyalar
        </p>

        {/* Track 1 — chapdan o'ngga */}
        <div className="relative mb-4">
          <div className="flex gap-0 marquee-track">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <div key={i}
                className="flex-shrink-0 flex items-center gap-3 mx-6 px-6 py-3
                  bg-ink-800/50 border border-ink-700/40 rounded-xl
                  hover:border-amber-500/30 hover:bg-ink-800 transition-all duration-300 group">
                <span className="text-2xl w-8 text-center select-none">{b.icon}</span>
                <span className="text-ink-300 font-semibold text-sm whitespace-nowrap
                  group-hover:text-amber-400 transition-colors">
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2 — o'ngdan chapga (teskari) */}
        <div className="relative">
          <div className="flex gap-0 marquee-track-reverse">
            {[...BRANDS.slice().reverse(), ...BRANDS.slice().reverse()].map((b, i) => (
              <div key={i}
                className="flex-shrink-0 flex items-center gap-3 mx-6 px-6 py-3
                  bg-ink-800/30 border border-ink-700/30 rounded-xl
                  hover:border-amber-500/20 hover:bg-ink-800/60 transition-all duration-300 group">
                <span className="text-2xl w-8 text-center select-none">{b.icon}</span>
                <span className="text-ink-400 font-medium text-sm whitespace-nowrap
                  group-hover:text-ink-200 transition-colors">
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-ink-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Nima uchun ResumeAI?</h2>
            <p className="text-ink-400 text-lg">Boshqa platformalardan farqli</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Sparkles className="text-amber-400" />, title: 'AI optimallashtirish', desc: 'Claude AI ish tajribangizni professional tilda yozib beradi, ATS kalit so\'zlarni qo\'shadi.' },
              { icon: <FileText className="text-sage-400" />,  title: '5 ta shablon',        desc: 'Minimal, Professional, Modern, Creative va Academic — har bir kasbga mos dizayn.' },
              { icon: <Download className="text-amber-400" />, title: 'Bir click PDF + Word', desc: 'Tayyor rezumeni PDF yoki Word (.docx) formatda yuklab oling yoki havolani ulashing.' },
              { icon: <Globe className="text-sage-400" />,     title: 'Ko\'p tillilik',       desc: 'O\'zbek, Rus yoki Ingliz tilida rezume — AI avtomatik tarjima qiladi.' },
              { icon: <BarChart2 className="text-amber-400" />,title: 'ATS ball tekshiruv',  desc: 'Rezumengizning ATS tizimlariga mosligi tekshiriladi va yaxshilash yo\'llari ko\'rsatiladi.' },
              { icon: <Mail className="text-sage-400" />,      title: 'Motivatsion xat',     desc: 'AI rezumengiz asosida istalgan kompaniya uchun cover letter yozib beradi.' },
            ].map((f, i) => (
              <div key={i}
                className="bg-ink-800/60 border border-ink-700/60 rounded-2xl p-6 hover:bg-ink-800 hover:border-ink-600 transition-all group">
                <div className="w-10 h-10 bg-ink-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-ink-100 mb-2">{f.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Bugun professional<br />
            <span className="text-amber-400">rezume</span> yarating
          </h2>
          <p className="text-ink-400 mb-10 text-lg">Ro'yxatdan o'tish bepul. Karta talab qilinmaydi.</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-ink-950 font-semibold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-amber-500/20">
            Hoziroq boshlang
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-ink-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-ink-500 text-sm">
          <span className="font-display font-semibold text-amber-400/70">ResumeAI</span>
          <span>© 2025 Resume Builder AI Platform</span>
        </div>
      </footer>

      {/* ── Marquee CSS ───────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .marquee-track {
          animation: marquee 32s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .marquee-track-reverse {
          animation: marquee-reverse 28s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .marquee-track:hover,
        .marquee-track-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </main>
  );
}
