"use client";

import { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';

export default function NotificationBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Initial wait could be 3 minutes, but for better UX, maybe show it soon after load
        // But the requirement says "mỗi 3 phút 1 lần" (once every 3 minutes).
        const intervalTime = 3 * 60 * 1000; // 3 minutes
        const displayTime = 30 * 1000; // 30 seconds

        const intervalId = setInterval(() => {
            setIsVisible(true);
            setTimeout(() => setIsVisible(false), displayTime);
        }, intervalTime);

        // Show banner quickly on initial load
        const initialTimeout = setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => setIsVisible(false), displayTime);
        }, 3000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(initialTimeout);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white py-3 px-4 shadow-lg border-t border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="container mx-auto flex items-center gap-3">
                <div className="flex-shrink-0 bg-orange-500 text-white p-1.5 rounded-full">
                    <Megaphone className="w-5 h-5 animate-pulse" />
                </div>

                {/* Marquee Wrapper */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="whitespace-nowrap animate-marquee">
                        <span className="font-medium mr-10">🔥 Ưu đãi độc quyền hôm nay: Nhập mã <strong className="text-orange-400">GIAM10K</strong> để được giảm ngay 10.000đ cho mọi đơn hàng từ 100.000đ! Nhanh tay kẻo lỡ.</span>
                        <span className="font-medium mr-10">🍑 Khám phá hương vị miền Tây với Sầu riêng Cai Lậy, Bưởi da xanh Bến Tre đang có giá cực ưu đãi.</span>
                        <span className="font-medium mr-10">🔥 Ưu đãi độc quyền hôm nay: Nhập mã <strong className="text-orange-400">GIAM10K</strong> để được giảm ngay 10.000đ cho mọi đơn hàng từ 100.000đ! Nhanh tay kẻo lỡ.</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 text-slate-400 hover:text-white transition-colors p-1"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    display: inline-block;
                    padding-left: 100%;
                    animation: marquee 25s linear infinite;
                }
            `}</style>
        </div>
    );
}
