import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "Bazar Dor is a price portal for Bangladeshi Daily Bazar Update",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${notoSerifBengali.className} ${notoSerifBengali.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        </body>
    </html>
  );
}
