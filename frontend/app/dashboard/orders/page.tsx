"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function MyOrders() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    const updateStatus = async (id: number, status: string) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            toast.success('Cập nhật trạng thái thành công');
        } catch (err) {
            toast.error('Lỗi cập nhật');
        }
    };

    if (!user) return <div className="p-20 text-center">Đang tải...</div>;

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <h1 className="text-3xl font-serif font-bold text-orange-950 mb-8">Đơn hàng của tôi</h1>

            {orders.length === 0 && !loading ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-orange-100">
                    <PackageOpen className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-orange-950 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-muted-foreground">Có vẻ như bạn chưa có giao dịch nào cả.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(o => (
                        <div key={o.id} className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-orange-50">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-orange-950 text-lg">Đơn hàng #{o.id}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {o.status.toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-primary font-bold text-xl">{new Intl.NumberFormat('vi-VN').format(o.total_amount)}đ</span>
                            </div>

                            <div className="space-y-4 mb-6">
                                {o.items?.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200'} className="w-16 h-16 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <p className="font-bold text-orange-950">{item.product?.name}</p>
                                            <p className="text-sm text-muted-foreground">Số lượng: x{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {user.role === 'seller' && o.status === 'pending' && (
                                <div className="flex gap-2">
                                    <Button onClick={() => updateStatus(o.id, 'confirmed')} className="bg-primary hover:bg-orange-700 text-white rounded-xl">Xác nhận đơn</Button>
                                    <Button onClick={() => updateStatus(o.id, 'cancelled')} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl">Huỷ đơn</Button>
                                </div>
                            )}
                            {user.role === 'seller' && o.status === 'confirmed' && (
                                <Button onClick={() => updateStatus(o.id, 'shipping')} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">Dịch vụ đang giao</Button>
                            )}
                            {user.role === 'buyer' && o.status === 'shipping' && (
                                <Button onClick={() => updateStatus(o.id, 'delivered')} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">Xác nhận đã nhận hàng</Button>
                            )}
                            {user.role === 'buyer' && o.status === 'pending' && (
                                <Button onClick={() => updateStatus(o.id, 'cancelled')} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl">Huỷ đơn hàng</Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
