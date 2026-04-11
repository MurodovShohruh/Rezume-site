import Link from 'next/link';
import { ArrowRight, Sparkles, FileText, Download, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-ink-50 overflow-hidden">

      {/* ── Author bar ──────────────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-amber-500/95 backdrop-blur-sm border-b border-amber-400/50 py-1.5">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-2">
          <span className="text-xs text-amber-950/60 font-medium">Muallif</span>
          <span className="text-amber-950/40">·</span>
          <span className="text-sm font-bold text-ink-950 tracking-tight">
            MurodovShohruh
          </span>
          <span className="text-xs text-amber-900/70 font-medium">
            ༺ 𒆜ASC𒆜 ༻
          </span>
        </div>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-8 inset-x-0 z-50 border-b border-ink-800/60 backdrop-blur-md bg-ink-950/80">
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

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sage-600/10 rounded-full blur-3xl" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#f7f6f3 1px, transparent 1px), linear-gradient(90deg, #f7f6f3 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center stagger">
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

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-ink-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Nima uchun ResumeAI?</h2>
            <p className="text-ink-400 text-lg">Boshqa platformalardan farqli</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="text-amber-400" />,
                title: 'AI optimallashtirish',
                desc: 'Claude AI ish tajribangizni professional tilda yozib beradi, ATS kalit so\'zlarni qo\'shadi.',
              },
              {
                icon: <FileText className="text-sage-400" />,
                title: '5 ta shablon',
                desc: 'Minimal, Professional, Modern, Creative va Academic — har bir kasbga mos dizayn.',
              },
              {
                icon: <Download className="text-amber-400" />,
                title: 'Bir click PDF',
                desc: 'Tayyor rezumeni PDF formatda yuklab oling yoki havolani ulashing.',
              },
              {
                icon: <Globe className="text-sage-400" />,
                title: 'Ko\'p tillilik',
                desc: 'O\'zbek, Rus yoki Ingliz tilida rezume — AI avtomatik tarjima qiladi.',
              },
              {
                icon: <Sparkles className="text-amber-400" />,
                title: 'Public profil',
                desc: 'Rezumengizni ochiq qiling — boshqalar URL orqali ko\'ra olsin.',
              },
              {
                icon: <FileText className="text-sage-400" />,
                title: 'Real-time preview',
                desc: 'Ma\'lumot kiritish bilan bir vaqtda shablon qanday ko\'rinishini ko\'rsatadi.',
              },
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

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
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

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-ink-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-ink-500 text-sm">
          <span className="font-display font-semibold text-amber-400/70">ResumeAI</span>
          <span className="flex items-center gap-2">
            <span className="text-ink-600">Muallif:</span>
            <span className="text-amber-400/80 font-semibold">MurodovShohruh</span>
            <span className="text-ink-700">༺ 𒆜ASC𒆜 ༻</span>
          </span>
          <span>© 2025 Resume Builder AI Platform</span>
        </div>
      </footer>
    </main>
  );
}
