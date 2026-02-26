"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, TrendingUp, ShoppingBag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
    const { user } = useAuthStore();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [newProduct, setNewProduct] = useState({
        name: '',
        category_id: 1,
        price: 0,
        stock_quantity: 0,
        origin_location: '',
        description: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data.filter((p: any) => p.seller_id === user?.id));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchProducts();
    }, [user]);

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/seller/products', newProduct);
            setProducts([...products, res.data]);
            toast.success('Thêm sản phẩm thành công');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Lỗi khi thêm sản phẩm');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc xoá sản phẩm này?')) return;
        try {
            await api.delete(`/seller/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            toast.success('Đã xoá sản phẩm');
        } catch (err) {
            toast.error('Lỗi khi xoá');
        }
    };

    if (!user || user.role !== 'seller') {
        return <div className="p-20 text-center text-xl font-bold">Không có quyền truy cập</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-orange-950 mb-2">Kênh Người Bán</h1>
                    <p className="text-muted-foreground">Xin chào, {user.name}!</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-orange-700 text-white rounded-full px-6 shadow-md h-12">
                            <Plus className="w-5 h-5 mr-2" /> Thêm sản phẩm mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Thêm Đặc Sản Mới</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateProduct} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Tên sản phẩm</Label>
                                <Input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Giá (VNĐ)</Label>
                                    <Input type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Số lượng (Kho)</Label>
                                    <Input type="number" required value={newProduct.stock_quantity} onChange={e => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Nơi xuất xứ (Tỉnh/Thành)</Label>
                                <Input required value={newProduct.origin_location} onChange={e => setNewProduct({ ...newProduct, origin_location: e.target.value })} />
                            </div>
                            <Button type="submit" className="w-full bg-primary hover:bg-orange-700 text-white h-11 rounded-xl">Lưu sản phẩm</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-primary"><Package className="w-6 h-6" /></div>
                    <div><p className="text-muted-foreground text-sm">Sản phẩm hiện có</p><p className="text-2xl font-bold text-orange-950">{products.length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-green-600"><ShoppingBag className="w-6 h-6" /></div>
                    <div><p className="text-muted-foreground text-sm">Đơn hàng mới</p><p className="text-2xl font-bold text-orange-950">5</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-blue-600"><TrendingUp className="w-6 h-6" /></div>
                    <div><p className="text-muted-foreground text-sm">Doanh thu tháng</p><p className="text-2xl font-bold text-orange-950">12.5M đ</p></div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
                <div className="p-6 border-b border-orange-50"><h3 className="text-xl font-bold font-serif text-orange-950">Danh sách đặc sản của bạn</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-orange-50/50 text-orange-950 text-sm">
                            <tr>
                                <th className="p-4 font-medium pl-6">Sản phẩm</th>
                                <th className="p-4 font-medium">Giá bán</th>
                                <th className="p-4 font-medium">Kho</th>
                                <th className="p-4 font-medium text-right pr-6">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b border-orange-50 last:border-0 hover:bg-orange-50/20">
                                    <td className="p-4 pl-6 flex items-center gap-3">
                                        <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80'} className="w-12 h-12 rounded-xl object-cover" />
                                        <span className="font-bold text-orange-950">{p.name}</span>
                                    </td>
                                    <td className="p-4 text-primary font-bold">{new Intl.NumberFormat('vi-VN').format(p.price)}đ</td>
                                    <td className="p-4">{p.stock_quantity}</td>
                                    <td className="p-4 pr-6 text-right">
                                        <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(p.id)}>Xoá</Button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && !loading && (
                                <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">Bạn chưa đăng bán sản phẩm nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
