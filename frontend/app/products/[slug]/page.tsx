"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Star, Truck, ShieldCheck, ShoppingCart, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/slug/${slug}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
            seller_id: product.seller_id
        });
        toast.success('Đã thêm vào giỏ hàng');
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Skeleton className="w-full aspect-square rounded-3xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h2 className="text-3xl font-serif font-bold text-orange-950 mb-4">Không tìm thấy sản phẩm</h2>
                <p className="text-muted-foreground">Sản phẩm này không tồn tại hoặc đã bị xoá.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-sm border border-orange-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                    <div className="space-y-4">
                        <div className="aspect-square rounded-3xl overflow-hidden bg-orange-50">
                            <img
                                src={product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="bg-orange-100 text-primary text-xs font-bold px-3 py-1 rounded-full">{product.category?.name}</span>
                            <span className="text-sm border border-orange-200 text-orange-800 px-3 py-1 rounded-full">{product.origin_location}</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-serif font-bold text-orange-950 mb-4 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center text-amber-500">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                                <span className="ml-2 text-orange-950 font-medium">5.0 (24 đánh giá)</span>
                            </div>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">Đã bán 120+</span>
                        </div>

                        <div className="text-4xl font-bold text-primary mb-8">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed whitespace-pre-line">
                            {product.description || 'Đặc sản trứ danh mang phong vị ẩm thực truyền thống, được chế biến từ những nguyên liệu tươi ngon nhất của địa phương.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <Truck className="w-6 h-6 text-primary" />
                                <span className="text-sm font-medium text-orange-950">Giao hàng hoả tốc</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <span className="text-sm font-medium text-orange-950">Sản phẩm chính gốc</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-orange-950">Số lượng:</span>
                                <div className="flex items-center bg-orange-50 rounded-full border border-orange-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-orange-950 hover:text-primary transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-orange-950 hover:text-primary transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-muted-foreground ml-2">{product.stock_quantity} sản phẩm có sẵn</span>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    size="lg"
                                    className="flex-1 bg-primary hover:bg-orange-700 text-white rounded-full h-14 text-lg font-medium shadow-lg shadow-orange-200 transition-all hover:-translate-y-1"
                                >
                                    <ShoppingCart className="mr-2 w-5 h-5" /> Thêm vào giỏ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
