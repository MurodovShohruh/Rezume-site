# Resume Builder AI – Backend

Django REST Framework asosidagi backend. Claude AI yordamida professional rezume yaratish platformasi.

---

## Texnologiyalar

- **Python 3.12** + **Django 5.0**
- **PostgreSQL** – asosiy baza
- **JWT** – autentifikatsiya (access 15 min, refresh 7 kun)
- **Claude AI** (Anthropic) – matn optimallashtirish
- **WeasyPrint** – PDF generatsiya
- **AWS S3** – fayl saqlash
- **Celery + Redis** – asinxron vazifalar
- **drf-spectacular** – Swagger/OpenAPI hujjatlash

---

## O'rnatish (Local)

### 1. Muhit tayyorlash

```bash
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. .env fayl

```bash
cp .env.example .env
# .env faylni to'ldiring
```

### 3. Ma'lumotlar bazasi

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 4. Serverni ishga tushirish

```bash
python manage.py runserver
```

---

## Docker bilan ishga tushirish

```bash
# Faqat bir marta:
docker-compose up --build

# Migratsiya:
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

---

## API Hujjatlar

Server ishga tushgandan so'ng:

| URL | Tavsif |
|-----|--------|
| `http://localhost:8000/api/docs/` | Swagger UI |
| `http://localhost:8000/api/redoc/` | ReDoc |
| `http://localhost:8000/api/schema/` | OpenAPI JSON |
| `http://localhost:8000/admin/` | Django Admin |

---

## Asosiy Endpointlar

### Auth
| Method | URL | Tavsif |
|--------|-----|--------|
| POST | `/api/auth/register/` | Ro'yxatdan o'tish |
| POST | `/api/auth/login/` | Kirish |
| POST | `/api/auth/logout/` | Chiqish |
| POST | `/api/auth/refresh/` | Token yangilash |
| GET/PATCH | `/api/auth/me/` | Profil |

### Resume
| Method | URL | Tavsif |
|--------|-----|--------|
| GET/POST | `/api/resumes/` | Ro'yxat / Yaratish |
| GET/PUT/PATCH/DELETE | `/api/resumes/{id}/` | CRUD |
| POST | `/api/resumes/{id}/export-pdf/` | PDF yaratish |
| PATCH | `/api/resumes/{id}/toggle-public/` | Public/Private |

### AI
| Method | URL | Tavsif |
|--------|-----|--------|
| POST | `/api/ai/resumes/{id}/generate/` | AI optimallashtirish |
| POST | `/api/ai/resumes/{id}/cover-letter/` | Motivatsion xat (V2) |
| POST | `/api/ai/resumes/{id}/ats-analysis/` | ATS tahlil (V2) |

### Public
| Method | URL | Tavsif |
|--------|-----|--------|
| GET | `/api/public/{slug}/` | Ochiq rezume |
| GET | `/api/gallery/` | Barcha ochiq rezumeler |

### Statistika
| Method | URL | Tavsif |
|--------|-----|--------|
| GET | `/api/statistics/me/` | Foydalanuvchi statistikasi |

---

## Testlar

```bash
python manage.py test apps.testing.tests
```

---

## Deploy (Railway / Render)

```bash
# Muhit o'zgaruvchilarini set qiling:
SECRET_KEY=...
DEBUG=False
DATABASE_URL=...
ANTHROPIC_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_STORAGE_BUCKET_NAME=...
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Build command:
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput

# Start command:
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3
```

---

## Loyiha Bosqichlari

| Bosqich | Holat | Asosiy imkoniyatlar |
|---------|-------|---------------------|
| **MVP (V1)** | ✅ Tayyor | Auth, Resume CRUD, AI, PDF, 2 shablon |
| **V2** | 🔜 Keyingi | Email tasdiqlash, Gallery, Cover Letter, ATS |
| **V3** | 🔜 Kelajak | LinkedIn import, HR panel, Premium shablonlar |


# Resume Builder AI — Frontend

Next.js 14 App Router asosidagi frontend. Playfair Display + DM Sans shriftlari, amber/ink rang sistemasi.

---

## Texnologiyalar

| Qatlam | Texnologiya |
|--------|-------------|
| Framework | Next.js 14 (App Router) |
| UI | Tailwind CSS — custom design system |
| Shriftlar | Playfair Display (sarlavha) + DM Sans (matn) |
| State | Zustand (auth + resume builder) |
| Server state | TanStack Query v5 |
| Form | React Hook Form + Zod |
| Animation | Framer Motion + CSS |
| Notifications | Sonner |
| HTTP | Axios + JWT auto-refresh |

---

## O'rnatish

```bash
npm install
cp .env.local.example .env.local
# .env.local ni to'ldiring
npm run dev
```

---

## Sahifalar

| URL | Tavsif |
|-----|--------|
| `/` | Landing page |
| `/login` | Tizimga kirish |
| `/register` | Ro'yxatdan o'tish |
| `/dashboard` | Rezumeler boshqaruvi |
| `/dashboard/stats` | Statistika |
| `/resume/new` | 5 qadamli resume builder |
| `/resume/[id]` | Resume ko'rish, AI, PDF |
| `/public/[slug]` | Ochiq resume sahifasi |

---

## Dizayn tizimi

**Ranglar:**
- `ink-*` — asosiy neytral ranglar (qora-jigarrang)
- `amber-*` — asosiy accent rang (to'q sariq)
- `sage-*` — ikkinchi accent (yashil)

**Shriftlar:**
- `font-display` — Playfair Display (sarlavhalar)
- `font-body` — DM Sans (matn)

**Animatsiyalar:**
- `.stagger` — bolalar elementlarni ketma-ket chiqaradi
- `.animate-fade-up` — pastdan yuqoriga fade
- `.skeleton` — loading placeholder

---

## Resume Builder jarayoni

1. **Shaxsiy** — ism, email, telefon, shahar, havolalar
2. **Tajriba** — ish joylari (ko'plab qo'shish mumkin)
3. **Ta'lim** — o'quv joylari
4. **Ko'nikmalar** — skills, tillar, sertifikatlar
5. **Shablon** — dizayn + til tanlash, saqlash

---

## Deploy (Vercel)

```bash
# Environment variables:
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Build:
npm run build
```
