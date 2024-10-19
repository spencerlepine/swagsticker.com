import type { Metadata } from 'next';
import CartProvider from '@/providers/CartProvider';
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-background font-sans text-balance flex flex-col h-screen `}>
        <CartProvider>
          <Header />
          <main className="container mx-auto flex-grow font-[family-name:var(--font-geist-sans)]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
