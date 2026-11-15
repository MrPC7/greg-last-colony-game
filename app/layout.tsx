import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import AppShell from "@/components/ui/AppShell";
import { asset } from "@/lib/asset";
import { UI } from "@/lib/content/ui";
import "./globals.css";

// Static metadata is Spanish-first; AppShell updates document.title and <html lang> on the client.
// Link-preview crawlers do not run JS and see one static HTML per page, so the Open Graph /
// Twitter card carries both languages side by side (ES first) plus es/en locales.
const both = (key: "app.title" | "app.description" | "app.ogImageAlt") => `${UI[key].es} · ${UI[key].en}`;
const ogImage = {
  url: asset("/img/keyart.jpg"),
  width: 1400,
  height: 779,
  type: "image/jpeg",
  alt: both("app.ogImageAlt"),
};

export const metadata: Metadata = {
  // Absolute base for og:image / og:url (custom-domain origin; see .env.production and deploy.yml).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: UI["app.title"].es,
  description: UI["app.description"].es,
  openGraph: {
    type: "website",
    siteName: both("app.title"),
    title: both("app.title"),
    description: both("app.description"),
    url: asset("/"),
    locale: "es_ES",
    alternateLocale: ["en_US"],
    images: [ogImage],
  },
  // Opened from the iPhone home screen the game runs full screen (iPhone Safari has no Fullscreen
  // API for pages; the ⛶ button explains this, components/ui/FullscreenButton.tsx).
  appleWebApp: { capable: true, title: UI["app.title"].es, statusBarStyle: "black-translucent" },
  twitter: {
    card: "summary_large_image",
    title: both("app.title"),
    description: both("app.description"),
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// The prototype's --map / --key / --cast CSS variables, pointing at the extracted images.
const imageVars = {
  "--map": `url(${asset("/img/map.webp")})`,
  "--map-sm": `url(${asset("/img/map-sm.webp")})`,
  "--key": `url(${asset("/img/keyart.webp")})`,
  "--cast": `url(${asset("/img/cast.webp")})`,
  "--brief": `url(${asset("/img/briefing.webp")})`,
  "--brief-sm": `url(${asset("/img/briefing-sm.webp")})`,
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body style={imageVars}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
