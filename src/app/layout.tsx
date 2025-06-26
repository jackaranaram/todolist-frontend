import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/DynamicIslandTodo.css"
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";
import Header from "@/components/header";
import MouseMoveEffect from "@/components/shared/mouse-move-effect";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "To-Do List | Arack",
  description: "Organiza tus tareas diarias con estilo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script 
          src="https://accounts.google.com/gsi/client" 
          async 
          defer
        ></script>
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MouseMoveEffect />
            <Header />
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
