"""
Claude AI uchun prompt shablonlar.
"""

LANGUAGE_NAMES = {
    'uz': "O'zbek",
    'ru': "Ruscha",
    'en': "English",
}

OPTIMIZE_RESUME_PROMPT = """
Sen professional CV/rezume yozish mutaxassisisan.
Quyidagi foydalanuvchi ma'lumotlarini {language} tilida professional tarzda qayta yoz.

Qoidalar:
1. Ish tajribasi tavsiflarini kuchli fe'llar bilan boshlang (Developed, Led, Increased, Managed...)
2. Imkon qadar raqamli natijalar qo'shing (%, soni, davr)
3. ATS tizimlari uchun kalit so'zlarni tabiiy tarzda joylashtiring
4. Grammatika va uslubni to'g'rilang
5. Har bir ish tajribasi tavsifi 2-4 jumladan iborat bo'lsin
6. Qisqacha tavsif (summary) 3-4 jumladan iborat bo'lsin

Foydalanuvchi ma'lumotlari:
{resume_data}

Faqat JSON formatda javob ber, boshqa hech narsa yozma:
{{
  "summary": "yangilangan qisqacha tavsif",
  "experience": [
    {{
      "index": 0,
      "description": "yangilangan tavsif"
    }}
  ]
}}
"""

GENERATE_COVER_LETTER_PROMPT = """
Sen professional motivatsion xat yozish mutaxassisisan.
Quyidagi rezume asosida {language} tilida motivatsion xat yoz.

Ish o'rni: {job_title}
Kompaniya: {company_name}

Rezume ma'lumotlari:
{resume_data}

Motivatsion xat 3-4 paragrafdan iborat bo'lsin:
1. Kirish - nega bu lavozimga qiziqish
2. Asosiy qism - tajriba va ko'nikmalar
3. Kompaniyaga qo'shim - nima bera olaman
4. Xulosa - uchrashuvga taklif

Faqat motivatsion xat matnini ber, hech qanday qo'shimcha tushuntirish yozma.
"""

ATS_ANALYSIS_PROMPT = """
Sen ATS (Applicant Tracking System) mutaxassisisan.
Quyidagi rezumeni tahlil qil va ball ber.

Rezume:
{resume_data}

Lavozim tavsifi (agar berilgan bo'lsa):
{job_description}

Faqat JSON formatda javob ber:
{{
  "score": 75,
  "strengths": ["kuchli tomonlar"],
  "weaknesses": ["zaif tomonlar"],
  "missing_keywords": ["yo'q kalit so'zlar"],
  "suggestions": ["tavsiyalar"]
}}
"""
