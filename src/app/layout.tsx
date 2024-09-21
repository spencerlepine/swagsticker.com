import type { Metadata } from 'next';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Developer laptop stickers | SwagSticker.com',
  description: 'The one-stop-shop for developer laptop stickers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Header />
          <main className="font-[family-name:var(--font-geist-sans)]">{children}</main>
          <Footer />
        </body>
      </UserProvider>
    </html>
  );
}
