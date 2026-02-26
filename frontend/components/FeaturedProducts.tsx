"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';
import { Sparkles } from 'lucide-react';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch first page, limit 8
                const res = await api.get('/products?page=1&limit=8');
                if (res.data && res.data.data !== undefined) {
                    setProducts(res.data.data);
                } else {
                    setProducts(res.data?.slice(0, 8) || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="py-24 bg-white relative z-20">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-primary text-sm font-bold mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Đang Bán Chạy</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-orange-950 tracking-tight">Đặc Sản Đề Xuất</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4 font-light">Những sản phẩm được yêu thích nhất trong tuần, tuyển chọn từ các vùng nguyên liệu chuẩn nhất.</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="flex flex-col space-y-3 p-4 bg-white rounded-3xl border border-orange-50">
                                <Skeleton className="h-[250px] w-full rounded-2xl" />
                                <Skeleton className="h-5 w-3/4 mt-4" />
                                <Skeleton className="h-4 w-1/2 mt-2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
