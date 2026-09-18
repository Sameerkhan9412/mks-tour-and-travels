import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import ClientProvider from '@/components/client-provider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "MSK Holiday's Travel & Tours | Gateway to Unforgettable Journeys",
  description: "Book premium domestic and international tour packages with MSK Holiday's. Experience customized itineraries, trusted visa services, luxury stays, and 24/7 expert travel support.",
  keywords: "travel agency, tour packages, domestic tours, international tours, visa assistance, honeymoon tours, luxury travel, MSK Holidays",
  openGraph: {
    title: "MSK Holiday's Travel & Tours | Gateway to Unforgettable Journeys",
    description: "Book premium domestic and international tour packages with MSK Holiday's. Experience customized itineraries, trusted visa services, luxury stays, and 24/7 expert travel support.",
    url: 'https://mskholidays.com',
    siteName: "MSK Holiday's Travel & Tours",
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MSK Holiday's Travel & Tours",
    description: "Book premium domestic and international tour packages with MSK Holiday's.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <ClientProvider>
          <Header />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
