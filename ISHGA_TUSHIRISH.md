# Ishga tushirish yo'riqnomasi

## Papka tuzilmasi
```
Rezume-site/
├── backend/         ← Django backend
├── frontend/        ← Next.js frontend  
├── docker-compose.yml
└── ISHGA_TUSHIRISH.md
```

---

## 1. Backend (Docker bilan)

```bash
# Rezume-site/ papkasida:
cd Rezume-site-fixed

# ANTHROPIC_API_KEY ni o'rnating:
# backend/.env faylini oching va o'zgartiring:
#   ANTHROPIC_API_KEY=your-real-key-here

docker-compose up --build
```

---

## 2. Frontend (alohida terminal)

```bash
# frontend papkasiga kiring:
cd Rezume-site\frontend        # Windows
cd Rezume-site/frontend        # Mac/Linux

npm install
npm run dev
```

Keyin: http://localhost:3000

---

## Muhim: Agar 404 chiqsa

`npm run dev` ni **`frontend` papkasi ichida** ishlatganingizga ishonch hosil qiling.

Tekshirish: `package.json` fayli mavjudligini ko'ring:
```
dir package.json      # Windows
ls package.json       # Mac/Linux
```

Agar "File not found" chiqsa — siz noto'g'ri papkadasiz.
