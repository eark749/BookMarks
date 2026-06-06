import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "BookMarks",
  description: "Your personal bookmark manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#ffffff", color: "#111" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
