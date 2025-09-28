import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://aivibe.dev'),
  title: 'AI Vibe - AI와 함께하는 코딩 교육',
  description: 'ChatGPT, Claude, GitHub Copilot 등 최신 AI 도구를 활용하여 효율적으로 프로그래밍을 배우세요.',
  keywords: 'AI, 코딩교육, 프로그래밍, ChatGPT, GitHub Copilot, 개발자',
  authors: [{ name: 'AI Vibe Team' }],
  creator: 'AI Vibe',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://aivibe.dev',
    title: 'AI Vibe - AI와 함께하는 코딩 교육',
    description: 'ChatGPT, Claude, GitHub Copilot 등 최신 AI 도구를 활용하여 효율적으로 프로그래밍을 배우세요.',
    siteName: 'AI Vibe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Vibe - AI와 함께하는 코딩 교육',
    description: 'ChatGPT, Claude, GitHub Copilot 등 최신 AI 도구를 활용하여 효율적으로 프로그래밍을 배우세요.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.className}>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}