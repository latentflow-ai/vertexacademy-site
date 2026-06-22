import React from 'react';
import '../styles/index.css';
import '@/styles/tailwind.css';
import { ChatProvider } from '@/context/ChatContext';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Cursor from '@/components/motion/Cursor';
import ScrollToTop from '@/components/motion/ScrollToTop';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0b1f4d',
};

export const metadata = {
  title: 'Vertex Academy — The Knowledge Expert | Chennai',
  description:
    "Chennai's premium tuition centre. Small batches, expert faculty, and a 95% success rate. A unit of Thanga Ramachandran Educational Trust — since 2016.",
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/logo.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Cursor />
        <ScrollToTop />
        <SmoothScroll>
          <ChatProvider>{children}</ChatProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
