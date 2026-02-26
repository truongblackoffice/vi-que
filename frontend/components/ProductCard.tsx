import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: any }) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
            seller_id: product.seller_id
        });
        toast.success('Đã thêm vào giỏ hàng');
    };

    return (
        <Link href={`/products/${product.slug}`} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-orange-100 flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-orange-50">
                <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {product.is_featured && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                        Nổi bật
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <span>{product.origin_location}</span>
                    <span>•</span>
                    <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="ml-1 font-medium">4.8</span>
                    </div>
                </div>

                <h3 className="font-serif font-bold text-lg text-orange-950 mb-1 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-xl text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
                    <Button
                        onClick={handleAddToCart}
                        size="icon"
                        className="rounded-full bg-orange-100 text-primary hover:bg-primary hover:text-white transition-colors border-none"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Link>
    );
}
