import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Admin Panel | Vị Quê',
  description: 'Vị Quê Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="light">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen bg-slate-50 flex flex-col`}>
        <header className="bg-slate-900 text-white p-4 shadow-md flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          <span className="font-bold text-lg tracking-wide">Vị Quê | Secure Admin Portal</span>
        </header>
        <main className="flex-1 overflow-hidden">{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
