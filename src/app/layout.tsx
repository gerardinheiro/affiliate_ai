import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import type { Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Affiliate AI System",
  description: "Automated Affiliate Marketing Platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let locale = 'pt';
  let messages = {};

  try {
    locale = await getLocale();
  } catch (error) {
    console.warn("Could not get locale, defaulting to pt", error);
  }

  try {
    messages = await getMessages();
  } catch (error) {
    console.warn("Could not get messages, loading default", error);
    try {
      messages = (await import(`../../messages/${locale}.json`)).default;
    } catch (e) {
      console.error("Could not load default messages", e);
    }
  }

  return (
    <html lang={locale}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
