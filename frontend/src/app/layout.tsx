import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: { default: 'ResumeAI — Professional Rezume Yarating', template: '%s | ResumeAI' },
  description: 'Sun\'iy intellekt yordamida 10 daqiqada professional rezume yarating. PDF eksport, 5 ta shablon, ko\'p tillilik.',
  keywords: ['rezume', 'resume builder', 'AI resume', 'professional cv', 'O\'zbekiston'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192' },
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    title: 'ResumeAI — Professional Rezume Yarating',
    description: 'AI yordamida 10 daqiqada professional rezume',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="texture">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-dm-sans)',
                background: '#1e1a17',
                color: '#f7f6f3',
                border: '1px solid #3a322d',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
