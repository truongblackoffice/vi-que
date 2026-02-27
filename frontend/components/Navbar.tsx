"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, Search, LogOut, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const cartItemsCount = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));
    const router = useRouter();
    const pathname = usePathname();

    // Search Suggestions State
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle Debounced Search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        const fetchSuggestions = async () => {
            setIsSearching(true);
            try {
                const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
                if (res.data && res.data.data) {
                    setSuggestions(res.data.data);
                } else {
                    setSuggestions(res.data || []);
                }
            } catch (err) {
                console.error("Search err", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            logout();
            router.push('/');
        }
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm relative">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex flex-col">
                    <span className="font-serif text-3xl font-bold text-primary leading-tight hover:text-orange-700 transition">Vị Quê</span>
                </Link>

                {/* Search Bar with Autocomplete Dropdown - Hidden on /products */}
                {pathname !== '/products' && (
                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={dropdownRef}>
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm đặc sản miền tây..."
                                className="w-full h-11 pl-12 pr-4 rounded-full border border-orange-200 bg-orange-50/50 hover:bg-orange-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => {
                                    if (searchQuery.trim()) setShowSuggestions(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSearchSubmit();
                                }}
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500 animate-spin" />
                            )}
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && searchQuery.trim() && (
                            <div className="absolute top-14 left-0 w-full bg-white border border-orange-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[9999]">
                                {isSearching && suggestions.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> Đang tìm kiếm...
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <>
                                        <div className="py-2">
                                            <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Sản phẩm gợi ý</p>
                                            {suggestions.map((p) => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => {
                                                        setShowSuggestions(false);
                                                        router.push(`/products/${p.slug}`);
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-orange-50 cursor-pointer transition-colors"
                                                >
                                                    {p.images && p.images.length > 0 ? (
                                                        <img src={`http://localhost:8080${p.images[0]}`} alt={p.name} className="w-10 h-10 object-cover rounded-md shadow-sm border border-slate-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center">
                                                            <Search className="w-4 h-4 text-orange-300" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                                                        <p className="text-xs text-orange-600 font-medium">{new Intl.NumberFormat('vi-VN').format(p.price)}đ</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            onClick={handleSearchSubmit}
                                            className="bg-orange-50 p-3 text-center text-sm font-medium text-primary hover:bg-orange-100 cursor-pointer transition-colors border-t border-orange-100"
                                        >
                                            Xem tất cả kết quả cho "{searchQuery}"
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-slate-500 text-sm mb-1">Không tìm thấy sản phẩm nào</p>
                                        <p className="text-xs text-slate-400">Hãy thử từ khóa khác ví dụ: bưởi, sầu riêng, chả lụa...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link href="/products">
                        <Button variant="ghost" className="hidden sm:inline-flex text-orange-950 font-medium hover:text-primary hover:bg-orange-50 rounded-full px-4">Sản phẩm</Button>
                    </Link>

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative group hover:text-primary hover:bg-orange-50 rounded-full h-10 w-10">
                            <ShoppingCart className="h-[22px] w-[22px]" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
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
                                    <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer rounded-lg hover:bg-orange-50 hover:text-primary gap-2">
                                        <ShoppingCart className="h-4 w-4" />
                                        Kênh người bán
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer rounded-lg hover:bg-orange-50 hover:text-primary gap-2">
                                    <User className="h-4 w-4" />
                                    Hồ sơ của tôi
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/dashboard/orders')} className="cursor-pointer rounded-lg hover:bg-orange-50 hover:text-primary gap-2 mt-1">
                                    <ShoppingCart className="h-4 w-4" />
                                    Đơn mua của tôi
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-orange-50 my-1" />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg mt-1 gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Đăng xuất
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
