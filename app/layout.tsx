
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { FormProvider } from '@/contexts/form-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Producer - Professional Video Prompt Generator',
  description: 'Transform your ideas into professional AI video prompts with our intelligent form system.',
  keywords: 'AI video, video generation, prompt creation, RunwayML, Pika Labs, video AI',
  authors: [{ name: 'AI Producer Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <FormProvider>
            <div className="min-h-screen bg-[#F8F9FA]">
              {children}
            </div>
            <Toaster />
          </FormProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
