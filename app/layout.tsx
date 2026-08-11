import type { Metadata, Viewport } from "next";
import { TabBar } from "@/components/TabBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPARTAN AI — Ovqatlanish rejasi",
  description: "Kunlik ovqatlanish reja va progress trekeri",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f0b400",
};

const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('spartan:theme') || 'spartan';
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-page-gradient text-ink antialiased">
        <div className="safe-top" />
        <main className="mx-auto max-w-md px-4 pb-28 pt-4">{children}</main>
        <TabBar />
      </body>
    </html>
  );
}
