import Header from "@/components/header";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A todo management web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="p-5">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
