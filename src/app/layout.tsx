import type { Metadata } from "next";
import "./globals.css";
import { QuizProvider } from "@/lib/QuizContext";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Creator Personality Matcher",
  description: "Find your unique content angles based on your personality and background",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <QuizProvider>
            {children}
          </QuizProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
