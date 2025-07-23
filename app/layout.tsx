import './global.css';
import Navbar from './components/navbar';
import { Metadata } from 'next';
import { MenuStateProvider } from './context/menu-state-context';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://armamap.app'),
  title: {
    default: 'Ares Artillery Computer – Arma 3',
    template: '%s | Ares Artillery Computer – Arma 3',
  },
  description:
    'An interactive artillery calculator for Arma 3. Supports both MAAWS (redneck) and 2S9 Sochor & M4 Scorcher (classic).',
  alternates: {
    canonical: 'https://armamap.app',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://armamap.app',
    siteName: 'Ares Artillery Computer – Arma 3',
    title: 'Ares Artillery Computer – Arma 3',
    description:
      'An interactive artillery calculator for Arma 3. Supports both MAAWS (redneck) and 2S9 Sochor & M4 Scorcher (classic).',
    images: [
      {
        url: 'https://armamap.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ares Artillery Computer – Arma 3 preview',
      },
    ],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      {
        url: '/android-chrome-192x192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/android-chrome-512x512.png',
        type: 'image/png',
        sizes: '512x512',
      },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MenuStateProvider>
          <Navbar />
          {children}
        </MenuStateProvider>
      </body>
    </html>
  );
}
