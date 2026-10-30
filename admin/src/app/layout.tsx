import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { AuthGate } from "@/components/AuthGate";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kayamrut Admin",
    template: "%s | Kayamrut Admin",
  },
  description: "Kayamrut Farms operations panel",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
