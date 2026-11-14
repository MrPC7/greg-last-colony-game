import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import AppShell from "@/components/ui/AppShell";
import { asset } from "@/lib/asset";
import { UI } from "@/lib/content/ui";
import "./globals.css";

// Static metadata is Spanish-first; AppShell updates document.title and <html lang> on the client.
export const metadata: Metadata = {
  title: UI["app.title"].es,
  description: UI["app.description"].es,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// The prototype's --map / --key / --cast CSS variables, pointing at the extracted images.
const imageVars = {
  "--map": `url(${asset("/img/map.jpg")})`,
  "--key": `url(${asset("/img/keyart.jpg")})`,
  "--cast": `url(${asset("/img/cast.jpg")})`,
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
