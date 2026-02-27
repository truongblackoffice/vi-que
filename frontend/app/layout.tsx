import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NotificationBanner from '@/components/NotificationBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
    title: 'Vị Quê | Đặc sản thật - Vị quê nhà',
    description: 'My Tho & Dong Thap Specialties Marketplace - Auth and Premium local products',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi" className="light">
            <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col relative`}>
                <Navbar />
                <main className="flex-1 overflow-hidden">{children}</main>
                <Footer />
                <NotificationBanner />
                <Toaster position="bottom-right" />
            </body>
        </html>
    )
}
