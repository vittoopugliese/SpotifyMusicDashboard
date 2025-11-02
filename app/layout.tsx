import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { ContentLayout } from "@/components/content-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SpotifySessionProvider } from "@/contexts/spotify-session-context";

const josefinSans = Josefin_Sans({ 
  variable: "--font-josefin-sans", 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = { title: "Spori | Music Dashboard", description: "Spori is a music dashboard that allows you to track your listening habits and get insights into your music taste", icons: "https://www.svgrepo.com/show/349511/spotify.svg" };

// Root layout with sidebar that renders the sidebar and the main content
export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${josefinSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SpotifySessionProvider>
            <SidebarProvider>
              <AppSidebar />
              <ContentLayout>{children}</ContentLayout>
            </SidebarProvider>
          </SpotifySessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};