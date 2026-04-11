from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.auth_app.models import User
from apps.resume.models import Resume


SAMPLE_RESUME_DATA = {
    "personal": {
        "fullName": "Ali Valiyev",
        "email": "ali@example.com",
        "phone": "+998901234567",
        "city": "Toshkent",
        "summary": "5 yillik tajribali backend dasturchi"
    },
    "experience": [
        {
            "company": "Tech Startup",
            "position": "Backend Developer",
            "startDate": "2020-01",
            "endDate": None,
            "isCurrent": True,
            "description": "Django va FastAPI bilan API yaratdim"
        }
    ],
    "education": [
        {
            "institution": "TATU",
            "degree": "Bakalavr",
            "field": "Dasturiy injiniring",
            "startYear": 2016,
            "endYear": 2020
        }
    ],
    "skills": ["Python", "Django", "PostgreSQL", "Docker"],
    "languages": [
        {"name": "O'zbek", "level": "Native"},
        {"name": "English", "level": "B2"},
    ],
    "certificates": []
}


class ResumeTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='ali@example.com',
            full_name='Ali Valiyev',
            password='TestPass123!'
        )
        self.client.force_authenticate(user=self.user)
        self.list_url = reverse('resume-list-create')

    def _create_resume(self):
        return self.client.post(self.list_url, {
            'title': 'Backend Developer CV',
            'template_id': 'minimal',
            'data': SAMPLE_RESUME_DATA,
            'language': 'uz',
        }, format='json')

    def test_create_resume(self):
        res = self._create_resume()
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data['success'])
        self.assertEqual(Resume.objects.filter(user=self.user).count(), 1)

    def test_list_resumes(self):
        self._create_resume()
        self._create_resume()
        res = self.client.get(self.list_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['count'], 2)

    def test_get_resume_detail(self):
        create_res = self._create_resume()
        pk = create_res.data['data']['id']
        res = self.client.get(reverse('resume-detail', args=[pk]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_update_resume(self):
        create_res = self._create_resume()
        pk = create_res.data['data']['id']
        res = self.client.patch(
            reverse('resume-detail', args=[pk]),
            {'title': 'Yangilangan sarlavha'},
            format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_delete_resume(self):
        create_res = self._create_resume()
        pk = create_res.data['data']['id']
        res = self.client.delete(reverse('resume-detail', args=[pk]))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Resume.objects.filter(pk=pk).exists())

    def test_toggle_public(self):
        create_res = self._create_resume()
        pk = create_res.data['data']['id']
        res = self.client.patch(reverse('resume-toggle-public', args=[pk]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['data']['is_public'])

    def test_other_user_cannot_access(self):
        create_res = self._create_resume()
        pk = create_res.data['data']['id']

        other_user = User.objects.create_user(
            email='other@example.com',
            full_name='Other User',
            password='OtherPass123!'
        )
        self.client.force_authenticate(user=other_user)
        res = self.client.get(reverse('resume-detail', args=[pk]))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_public_resume_accessible_without_auth(self):
        create_res = self._create_resume()
        pk = create_res.data['data']['id']
        self.client.patch(reverse('resume-toggle-public', args=[pk]))

        resume = Resume.objects.get(pk=pk)
        self.client.force_authenticate(user=None)
        res = self.client.get(reverse('resume-public', args=[resume.slug]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
