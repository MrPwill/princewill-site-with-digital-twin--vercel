import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Princewill C. Chioma | AI Systems Engineer",
  description: "AI Systems Engineer based in Lagos, Nigeria. Expert in Multi-Agent Systems, RAG Pipelines, and MLOps. Building production AI systems with Python.",
  keywords: ["AI Systems Engineer", "Machine Learning", "Python", "RAG", "Multi-Agent", "LLM"],
  authors: [{ name: "Princewill C. Chioma" }],
  openGraph: {
    title: "Princewill C. Chioma | AI Systems Engineer",
    description: "AI Systems Engineer based in Lagos, Nigeria. Expert in Multi-Agent Systems, RAG Pipelines, and MLOps.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Syne:wght@400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}