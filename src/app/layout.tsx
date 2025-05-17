import type { Metadata } from 'next';
import { Pixelify_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { WalletProvider } from '@/hooks/use-wallet';
import Providers from '@/providers';
import { ThemeProvider } from '@/providers/theme-provider';

const roboto = Pixelify_Sans({
  variable: '--font-pixelify',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Monad Empire',
  description: 'Blockchain Game',
  icons: {
    icon: '/favicon.png',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <WalletProvider>
              <Header />
              {children}
            </WalletProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
