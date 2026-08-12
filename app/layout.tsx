import type { Metadata, Viewport } from "next";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/onest/600.css";
import "@fontsource/onest/700.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://slonik01.github.io/kindergarten-marketing";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "МАРКЕТИНГ",
  title: "МАРКЕТИНГ — дозагрузка русскоязычных детских садов",
  description:
    "Система привлечения русскоязычных семей в детские сады за границей: от первого касания до экскурсии и договора.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Заполните свободные места в детском саду",
    description:
      "Рассчитайте потенциал дозагрузки и выстройте понятный путь семьи от рекламы до договора.",
    type: "website",
    locale: "ru_RU",
    siteName: "МАРКЕТИНГ",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1672,
        height: 941,
        alt: "Маркетинг для дозагрузки русскоязычных детских садов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "МАРКЕТИНГ для русскоязычных детских садов",
    description: "Прогнозируемая система набора семей за границей.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        alt: "Маркетинг для дозагрузки русскоязычных детских садов",
      },
    ],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060606",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
