import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OuterBox Site Template",
  description: "Phase 1 demo of the OuterBox component library.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="bg-white font-sans text-dark-blue">{children}</body>
    </html>
  );
}
