import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookMarks",
  description: "Your personal bookmark manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#fafafa", color: "#111" }}>
        {children}
      </body>
    </html>
  );
}
