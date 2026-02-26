import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Package, Trash2 } from 'lucide-react';

export default function ProductsTableAdmin() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/admin/products');
            setProducts(res.data);
        } catch (err) {
            toast.error('Lỗi khi tải danh sách sản phẩm');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsHydrated(true);
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm này khỏi hệ thống?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            toast.success('Đã xóa sản phẩm thành công');
            fetchProducts();
        } catch (err) {
            toast.error('Lỗi khi xóa sản phẩm');
            console.error(err);
        }
    };

    if (!isHydrated) return null;
    if (loading) return <div className="p-8 text-center text-slate-500">Đang tải biểu mẫu...</div>;

    return (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <Package className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Kiểm duyệt Sản phẩm</h3>
                </div>
                <div className="text-sm text-slate-500">
                    Tổng: <strong>{products.length}</strong> sản phẩm
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-700 text-sm border-b">
                        <tr>
                            <th className="p-4 font-medium pl-6">Sản phẩm</th>
                            <th className="p-4 font-medium">Người bán</th>
                            <th className="p-4 font-medium">Giá bán</th>
                            <th className="p-4 font-medium text-center">Tồn kho</th>
                            <th className="p-4 font-medium text-right pr-6">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p: any) => (
                            <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        {p.images && p.images.length > 0 && (
                                            <img src={`http://localhost:8080${p.images[0]}`} alt={p.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                                            <p className="text-xs text-slate-500">{p.category?.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">{p.seller?.name || 'Vô danh'}</span>
                                </td>
                                <td className="p-4 font-bold text-slate-900 line-clamp-1">
                                    {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock_quantity > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {p.stock_quantity > 0 ? p.stock_quantity : 'Hết hàng'}
                                    </span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Xóa sản phẩm"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan={5} className="p-10 text-center text-slate-500">Chưa có sản phẩm nào trên hệ thống.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
