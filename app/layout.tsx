import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MEDIA Downloader',
  description: 'Download videos and media from multiple platforms quickly.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MEDIA Downloader"
  }
};

export const viewport: Viewport = {
  themeColor: '#E2E8F0',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#E2E8F0] font-sans text-[#020817] min-h-screen antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
