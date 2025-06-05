import type { Metadata } from 'next';
import { Chewy, Poppins } from 'next/font/google';

// Fonts
// hi-melody, cherry bomb one,
import './globals.css';

import { cn } from '@/lib/utils';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const chewy = Chewy({
  variable: '--font-chewy',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Japaneezy',
  description: 'Learn Japanese with Japaneezy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn('antialiased', poppins.variable, chewy.variable)}>{children}</body>
    </html>
  );
}
