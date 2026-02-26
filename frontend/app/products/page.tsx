"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

function ProductsContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category');

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState({
        search: '',
        category_id: initialCategory || 'all',
        origin: 'all',
        page: 1,
        limit: 12
    });

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filter.search, filter.category_id, filter.origin, filter.page]);

    // Reset pagination when searching/filtering
    useEffect(() => {
        if (filter.page !== 1) setFilter(f => ({ ...f, page: 1 }));
    }, [filter.search, filter.category_id, filter.origin]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.search) params.append('search', filter.search);
            if (filter.category_id !== 'all') params.append('category_id', filter.category_id);
            if (filter.origin !== 'all') params.append('origin', filter.origin);
            params.append('page', filter.page.toString());
            params.append('limit', filter.limit.toString());

            const res = await api.get(`/products?${params.toString()}`);

            // Extract from standard PaginatedProductResponse
            if (res.data && res.data.data !== undefined) {
                setProducts(res.data.data || []);
                setPagination({
                    total: res.data.total || 0,
                    totalPages: res.data.total_pages || 1
                });
            } else {
                // Fallback for older API versions
                setProducts(res.data || []);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold text-orange-950 mb-4">Khám phá đặc sản</h1>
                <p className="text-muted-foreground max-w-2xl">Lọc và tìm kiếm những món quà quê phù hợp nhất cho gia đình và người thân.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-4 rounded-3xl shadow-sm border border-orange-100">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Tìm theo tên sản phẩm..."
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        className="pl-12 h-12 bg-orange-50/50 border-transparent focus:bg-white rounded-2xl text-base"
                    />
                </div>

                <div className="w-full md:w-64">
                    <Select value={filter.category_id} onValueChange={(v) => setFilter({ ...filter, category_id: v })}>
                        <SelectTrigger className="h-12 bg-orange-50/50 border-transparent rounded-2xl">
                            <SelectValue placeholder="Tất cả danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả danh mục</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-56">
                    <Select value={filter.origin} onValueChange={(v) => setFilter({ ...filter, origin: v })}>
                        <SelectTrigger className="h-12 bg-orange-50/50 border-transparent rounded-2xl">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <SelectValue placeholder="Xuất xứ" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Mọi vùng miền</SelectItem>
                            <SelectItem value="Mỹ Tho">Mỹ Tho</SelectItem>
                            <SelectItem value="Đồng Tháp">Đồng Tháp</SelectItem>
                            <SelectItem value="Bến Tre">Bến Tre</SelectItem>
                            <SelectItem value="Gò Công">Gò Công</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                        <div key={i} className="flex flex-col space-y-3 p-4 bg-white rounded-3xl border border-orange-50">
                            <Skeleton className="h-[250px] w-full rounded-2xl" />
                            <Skeleton className="h-5 w-3/4 mt-4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                            <div className="flex justify-between mt-4">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination UI */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 bg-white p-4 rounded-3xl shadow-sm border border-orange-50 max-w-fit mx-auto">
                            <button
                                onClick={() => setFilter(f => ({ ...f, page: f.page - 1 }))}
                                disabled={filter.page === 1}
                                className="px-4 py-2 rounded-xl text-orange-950 hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent font-medium"
                            >
                                Trước
                            </button>

                            <div className="flex overflow-hidden rounded-xl border border-orange-100">
                                {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, idx) => {
                                    // Complex logic for sliding window pagination omitted for simplicity, 
                                    // keeping it basic standard 5 page view maximum logic:
                                    let pageNum = filter.page;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = idx + 1;
                                    } else if (filter.page <= 3) {
                                        pageNum = idx + 1;
                                    } else if (filter.page >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + idx;
                                    } else {
                                        pageNum = filter.page - 2 + idx;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setFilter(f => ({ ...f, page: pageNum }))}
                                            className={`w-10 h-10 flex flex-col items-center justify-center font-bold text-sm transition-colors border-r border-orange-50 last:border-0
                                                ${filter.page === pageNum ? 'bg-primary text-white' : 'bg-white text-orange-950 hover:bg-orange-50'}
                                            `}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setFilter(f => ({ ...f, page: f.page + 1 }))}
                                disabled={filter.page === pagination.totalPages}
                                className="px-4 py-2 rounded-xl text-orange-950 hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent font-medium"
                            >
                                Sau
                            </button>

                            <div className="ml-4 text-sm text-muted-foreground hidden md:block">
                                Trang {filter.page} / {pagination.totalPages}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-orange-100 border-dashed">
                    <h3 className="text-xl font-bold text-orange-950 mb-2 font-serif">Không tìm thấy sản phẩm</h3>
                    <p className="text-muted-foreground">Thử điều chỉnh bộ lọc để xem thêm các đặc sản khác.</p>
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
