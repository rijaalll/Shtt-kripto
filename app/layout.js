import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  icons: {
    icon: "logo.png",
  },
};

export const openGraph = {
  title: "Shtt",
  description: "Web untuk enkripsi dan dekripsi teks menggunakan berbagai algoritma kriptografi.",
  images: "logo.png",
};


export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased w-full h-auto min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
