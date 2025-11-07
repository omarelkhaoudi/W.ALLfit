import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "W.ALLfit - Application de Fitness",
    template: "%s | W.ALLfit",
  },
  description: "Suivez vos entraînements et votre progression fitness. Application moderne pour gérer vos séances de sport et atteindre vos objectifs.",
  keywords: ["fitness", "entraînement", "sport", "santé", "progression", "workout"],
  authors: [{ name: "W.ALLfit Team" }],
  creator: "W.ALLfit",
  publisher: "W.ALLfit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "W.ALLfit",
    title: "W.ALLfit - Application de Fitness",
    description: "Suivez vos entraînements et votre progression fitness",
  },
  twitter: {
    card: "summary_large_image",
    title: "W.ALLfit - Application de Fitness",
    description: "Suivez vos entraînements et votre progression fitness",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundaryWrapper>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              toastClassName="dark:bg-gray-800 dark:text-white rounded-2xl"
            />
          </ThemeProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
