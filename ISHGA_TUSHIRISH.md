# Resume Builder AI — Ishga tushirish yo'riqnomasi

## Loyiha tuzilmasi

```
Rezume-site/
├── backend/              ← Django 5 + DRF (Python)
│   ├── apps/
│   │   ├── auth_app/     ← JWT autentifikatsiya, email tasdiqlash
│   │   ├── resume/       ← Rezume CRUD, PDF/Word eksport
│   │   ├── ai/           ← Claude AI integratsiya
│   │   ├── statistics/   ← Ko'rishlar va yuklab olishlar statistikasi
│   │   └── testing/      ← Testlar (20 ta test)
│   ├── config/           ← Django sozlamalari
│   ├── common/           ← Umumiy yordamchi modullar
│   ├── templates/        ← Resume HTML shablonlari (5 xil)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── entrypoint.sh
├── frontend/             ← Next.js 14 + TypeScript
│   ├── src/
│   │   ├── app/          ← Next.js App Router sahifalari
│   │   ├── components/   ← React komponentlari
│   │   ├── lib/          ← API client, React Query
│   │   ├── store/        ← Zustand state management
│   │   └── types/        ← TypeScript turlari
│   ├── Dockerfile        ← (yangi qo'shildi)
│   └── next.config.js
├── docker-compose.yml    ← Barcha 5 servis (yangilandi)
├── .env.example          ← Muhit o'zgaruvchilari namunasi
└── ISHGA_TUSHIRISH.md    ← Shu fayl
```

---

## Texnologiyalar

| Qatlam     | Texnologiya                                          |
|------------|------------------------------------------------------|
| Backend    | Python 3.12, Django 5.0, Django REST Framework       |
| Auth       | JWT (SimpleJWT) — access 15 daqiqa, refresh 7 kun   |
| AI         | Anthropic Claude (resume optimallashtirish, ATS)     |
| PDF        | WeasyPrint (5 xil shablon)                           |
| Word       | python-docx                                          |
| Database   | PostgreSQL 16                                        |
| Cache/Queue| Redis 7 + Celery                                     |
| Storage    | AWS S3 (ixtiyoriy)                                   |
| Frontend   | Next.js 14, TypeScript, Tailwind CSS, Zustand        |
| API docs   | drf-spectacular (Swagger UI)                         |

---

## 1. Docker bilan ishga tushirish (tavsiya etiladi)

### Talab
- Docker Desktop o'rnatilgan bo'lishi kerak
- https://docs.docker.com/get-docker/

### Qadamlar

```bash
# 1. Loyiha papkasiga kiring
cd Rezume-site

# 2. Muhit faylini yarating
cp .env.example .env

# 3. .env faylni oching va ANTHROPIC_API_KEY ni o'rnating
nano .env

# 4. Barcha servislarni ishga tushiring
docker-compose up --build
```

### Tayyor manzillar

| Servis     | URL                             |
|------------|---------------------------------|
| Frontend   | http://localhost:3000           |
| Backend API| http://localhost:8000/api/      |
| Swagger UI | http://localhost:8000/api/docs/ |
| Admin panel| http://localhost:8000/admin/    |

### Superuser yaratish (ixtiyoriy)

```bash
docker-compose exec backend python manage.py createsuperuser
```

---

## 2. Local ishga tushirish (development)

### Backend

```bash
cd Rezume-site/backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # .env ni to'ldiring
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd Rezume-site/frontend
npm install
cp .env.local.example .env.local
npm run dev
```

---

## 3. Testlarni ishga tushirish

Testlar SQLite xotirada ishlaydi — PostgreSQL kerak emas.

```bash
cd Rezume-site/backend
python manage.py test apps.testing --settings=test_settings_override --verbosity=2
```

### Test natijalari (20/20 muvaffaqiyatli)

```
Auth testlari (8 ta):           ✅ hammasi o'tdi
Resume testlari (8 ta):         ✅ hammasi o'tdi
AI testlari (4 ta, mock bilan): ✅ hammasi o'tdi

Ran 20 tests in ~8s — OK
```

---

## 4. API endpointlari

### Auth  `/api/auth/`
- `POST register/` — Ro'yxatdan o'tish
- `POST login/` — Kirish
- `POST logout/` — Chiqish
- `POST refresh/` — Token yangilash
- `GET  me/` — Profil ma'lumotlari
- `POST verify-email/` — Email tasdiqlash
- `POST resend-verification/` — Qayta tasdiqlash xati

### Resume  `/api/resumes/`
- `GET  /` — Rezumeler ro'yxati
- `POST /` — Yangi rezume
- `GET  {id}/` — Rezume detail
- `PATCH {id}/` — Rezume yangilash
- `DELETE {id}/` — Rezume o'chirish
- `POST {id}/export-pdf/` — PDF yaratish
- `POST {id}/export-word/` — Word yaratish
- `PATCH {id}/toggle-public/` — Public/private

### AI  `/api/ai/resumes/`
- `POST {id}/generate/` — Resume matnini optimallashtirish
- `POST {id}/cover-letter/` — Motivatsion xat yaratish
- `POST {id}/ats-analysis/` — ATS tahlil

### Public
- `GET /api/public/{slug}/` — Ochiq resume ko'rish
- `GET /api/gallery/` — Barcha ochiq resumelar

---

## 5. Muhit o'zgaruvchilari

### Majburiy
| O'zgaruvchi       | Tavsif               |
|-------------------|----------------------|
| ANTHROPIC_API_KEY | Claude API kaliti    |
| SECRET_KEY        | Django secret key    |
| DB_NAME/USER/PASS | PostgreSQL           |

### Ixtiyoriy
| O'zgaruvchi         | Tavsif                    |
|---------------------|---------------------------|
| EMAIL_HOST_USER     | Gmail SMTP email          |
| EMAIL_HOST_PASSWORD | Gmail App Password        |
| AWS_ACCESS_KEY_ID   | S3 PDF saqlash            |
| REDIS_URL           | Celery broker (default: redis://localhost:6379/0) |

---

## 6. Muammolar va yechimlar

**"Connection refused"** — PostgreSQL/Redis ishlamayapti:
```bash
docker-compose ps
docker-compose logs db
```

**Frontend backend ga ulanmayapti** — `.env.local` da:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**PDF yaratilmayapti** — WeasyPrint tizim kutubxonalarini talab qiladi:
```bash
# Ubuntu/Debian
sudo apt-get install libpango-1.0-0 libpangoft2-1.0-0 libcairo2

# macOS
brew install pango cairo
```

**AI xatolari** — `.env` da `ANTHROPIC_API_KEY` to'g'ri o'rnatilganini tekshiring (`sk-ant-api03-...` bilan boshlanishi kerak).
