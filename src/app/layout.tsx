import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle, ThemeScript } from "@/components/learn/theme-toggle";
import { ScrollToTopBrain } from "@/components/learn/scroll-to-top";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "ML с нуля — интерактивный курс про веса и обучение модели",
  description:
    "Интерактивное приложение для новичков: разберитесь, что такое признаки, веса и метки, как модель учится на ошибках и почему данные решают всё. 10 модулей с живыми песочницами.",
  keywords: [
    "машинное обучение",
    "ML для новичков",
    "веса модели",
    "признаки",
    "метки",
    "градиентный спуск",
    "обучение модели",
    "интерактивный курс",
  ],
  authors: [{ name: "ML с нуля" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"],
  },
  openGraph: {
    title: "ML с нуля — интерактивный курс",
    description:
      "10 модулей с живыми песочницами: признаки, веса, метки, обучение, ошибка, данные.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <ThemeToggle />
        {children}
        <ScrollToTopBrain />
        <Toaster />
      </body>
    </html>
  );
}
