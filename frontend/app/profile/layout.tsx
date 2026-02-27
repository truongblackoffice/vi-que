"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { User, KeyRound, ShoppingBag, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

const menuItems = [
    { name: "Hồ sơ của tôi", href: "/profile", icon: User },
    { name: "Đổi mật khẩu", href: "/profile/password", icon: KeyRound },
    { name: "Đơn mua của tôi", href: "/dashboard/orders", icon: ShoppingBag }, // Tạm giữ URL cũ, hoặc đổi
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logout, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            logout();
            toast.success("Đăng xuất thành công");
            router.push("/");
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi đăng xuất");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-slate-800 truncate">{user?.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Đang trực tuyến
                                    </p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                                    ? "bg-orange-50 text-orange-600"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? "text-orange-500" : "text-slate-400"}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
                                >
                                    <LogOut className="w-5 h-5 text-red-500" />
                                    Đăng xuất
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
