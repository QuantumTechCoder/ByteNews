import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ByteNews - Developer News & Discussions",
  description:
    "A high-contrast, production-ready Hacker News clone built with Next.js App Router, Prisma, and the Vercel Geist design system.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('bytenews_theme') === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-[#FFFFFF] dark:bg-[#000000] text-[#171717] dark:text-[#EDEDED] min-h-screen flex flex-col font-sans selection:bg-[#FF6600] selection:text-black">
        <Header currentUser={currentUser} />
        <main className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-4 py-3">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
