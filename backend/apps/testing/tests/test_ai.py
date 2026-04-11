from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.auth_app.models import User
from apps.resume.models import Resume
from .test_resume import SAMPLE_RESUME_DATA


class AITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='ai_test@example.com',
            full_name='AI Test User',
            password='TestPass123!'
        )
        self.client.force_authenticate(user=self.user)

        self.resume = Resume.objects.create(
            user=self.user,
            title='Test CV',
            template_id='minimal',
            data=SAMPLE_RESUME_DATA,
            language='uz',
        )

    @patch('apps.ai.services.claude_service._get_client')
    def test_generate_ai_success(self, mock_get_client):
        """AI generatsiya muvaffaqiyatli ishlashi."""
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client

        mock_message = MagicMock()
        mock_message.content = [MagicMock(text='{"summary": "Professional backend dev", "experience": []}')]
        mock_client.messages.create.return_value = mock_message

        url = reverse('ai-generate', args=[self.resume.pk])
        res = self.client.post(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])
        self.assertIn('ai_content', res.data['data'])

        self.resume.refresh_from_db()
        self.assertIsNotNone(self.resume.ai_content)

    @patch('apps.ai.services.claude_service._get_client')
    def test_generate_ai_api_error(self, mock_get_client):
        """Claude API xatosi to'g'ri qaytarilishi."""
        mock_get_client.side_effect = Exception("API connection error")
        url = reverse('ai-generate', args=[self.resume.pk])
        res = self.client.post(url)
        self.assertEqual(res.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertFalse(res.data['success'])

    def test_generate_ai_empty_resume(self):
        """Bo'sh datali resume uchun xato."""
        empty_resume = Resume.objects.create(
            user=self.user,
            title='Bo\'sh CV',
            template_id='minimal',
            data={},
            language='uz',
        )
        url = reverse('ai-generate', args=[empty_resume.pk])
        res = self.client.post(url)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_generate_ai_other_user_resume(self):
        """Boshqa foydalanuvchining resumesiga kirish taqiqlangan."""
        other_user = User.objects.create_user(
            email='other2@example.com',
            full_name='Other',
            password='Pass123!'
        )
        self.client.force_authenticate(user=other_user)
        url = reverse('ai-generate', args=[self.resume.pk])
        res = self.client.post(url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
