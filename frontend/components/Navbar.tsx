"use client";

import Link from 'next/link';
import { ShoppingCart, User, Menu, Search, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const cartItemsCount = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            logout();
            router.push('/');
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex flex-col">
                    <span className="font-serif text-3xl font-bold text-primary leading-tight hover:text-orange-700 transition">Vị Quê</span>
                </Link>

                <div className="hidden md:flex flex-1 max-w-xl mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm đặc sản miền tây..."
                            className="w-full h-11 pl-12 pr-4 rounded-full border border-orange-200 bg-orange-50/50 hover:bg-orange-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link href="/products">
                        <Button variant="ghost" className="hidden sm:inline-flex text-orange-950 font-medium hover:text-primary hover:bg-orange-50 rounded-full px-4">Sản phẩm</Button>
                    </Link>

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative group hover:text-primary hover:bg-orange-50 rounded-full h-10 w-10">
                            <ShoppingCart className="h-[22px] w-[22px]" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="font-medium gap-2 hover:bg-orange-50 hover:text-primary rounded-full px-4">
                                    <User className="h-5 w-5" />
                                    <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-white border-orange-100 rounded-xl shadow-xl mt-2 p-2">
                                <div className="px-2 py-2 mb-2 border-b border-orange-50">
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                {user?.role === 'seller' && (
                                    <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer rounded-lg hover:bg-orange-50 hover:text-primary">
                                        Kênh người bán
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => router.push('/dashboard/orders')} className="cursor-pointer rounded-lg hover:bg-orange-50 hover:text-primary">Đơn hàng của tôi</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg mt-1">
                                    Đăng xuất
                                    <LogOut className="h-4 w-4 justify-self-end mt-1 absolute right-2" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/auth/login">
                            <Button className="bg-primary hover:bg-orange-700 text-white rounded-full px-6 transition-colors shadow-sm shadow-orange-200">
                                Đăng nhập
                            </Button>
                        </Link>
                    )}

                    <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-orange-50">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
