import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const googleSans = localFont({
  src: [
    {
      path: '../../public/fonts/GoogleSans-Medium.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GoogleSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GoogleSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-google-sans',
});

export const metadata: Metadata = {
  title: 'Agency Proposal Generator',
  description: 'Generate professional NextJS Design & Development Proposals instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${googleSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
