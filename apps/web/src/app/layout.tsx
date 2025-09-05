import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neeiz - แพลตฟอร์มจ้างงานที่เชื่อมโยงคนหางานกับนายจ้าง",
  description: "หางานที่ใช่ เจอคนที่ชอบ แพลตฟอร์มจ้างงานที่เชื่อมโยงคนหางานกับนายจ้างอย่างมีประสิทธิภาพ ด้วยเทคโนโลยีที่ทันสมัยและประสบการณ์การใช้งานที่ยอดเยี่ยม",
  keywords: "หางาน, จ้างงาน, แพลตฟอร์มงาน, งานในประเทศไทย, สมัครงาน, ประกาศงาน",
  authors: [{ name: "Neeiz Team" }],
  creator: "Neeiz",
  publisher: "Neeiz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://neeiz.lslly.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Neeiz - แพลตฟอร์มจ้างงานที่เชื่อมโยงคนหางานกับนายจ้าง",
    description: "หางานที่ใช่ เจอคนที่ชอบ แพลตฟอร์มจ้างงานที่เชื่อมโยงคนหางานกับนายจ้างอย่างมีประสิทธิภาพ",
    url: 'https://neeiz.lslly.com',
    siteName: 'Neeiz',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Neeiz - แพลตฟอร์มจ้างงาน',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Neeiz - แพลตฟอร์มจ้างงานที่เชื่อมโยงคนหางานกับนายจ้าง",
    description: "หางานที่ใช่ เจอคนที่ชอบ แพลตฟอร์มจ้างงานที่เชื่อมโยงคนหางานกับนายจ้างอย่างมีประสิทธิภาพ",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
