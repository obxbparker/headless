import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OuterBox Portal",
  description: "Internal portal for OuterBox project managers.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="min-h-screen bg-frost font-sans text-dark-blue">
        <header className="sticky top-0 z-40 border-b border-dark-blue/10 bg-white">
          <div className="mx-auto flex max-w-content items-center justify-between gap-md px-gutter-xl py-sm">
            <Link
              href="/"
              className="flex items-center gap-sm text-dark-blue hover:text-obx-blue transition-colors"
            >
              <span className="font-heading text-heading-4 font-black uppercase tracking-tight">
                OuterBox Portal
              </span>
              <span className="rounded-sm bg-orange px-xs py-xxs text-eyebrow font-bold uppercase tracking-eyebrow text-white">
                Internal
              </span>
            </Link>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-lg list-none p-0 m-0">
                <li>
                  <Link
                    href="/intake"
                    className="font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:text-orange transition-colors"
                  >
                    New intake
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-content px-gutter-xl py-section-y">
          {children}
        </main>
      </body>
    </html>
  );
}
