import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";
import { QueryProvider } from "@/lib/providers/query-provider";
import { cn } from "@/lib/utils/cn";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wine Cellar",
  description: "Master-detail wine inventory management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-gray-50")}>
        <QueryProvider>
          <ToastProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
