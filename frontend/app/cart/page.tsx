"use client";

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherStatus, setVoucherStatus] = useState<null | { valid: boolean; message: string; discount_amount: number }>(null);
    const [validatingVoucher, setValidatingVoucher] = useState(false);

    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const subtotal = getTotal();
    const discountAmount = voucherStatus?.valid ? (voucherStatus.discount_amount || 0) : 0;
    const finalTotal = subtotal - discountAmount > 0 ? subtotal - discountAmount : 0;

    const handleApplyVoucher = async () => {
        if (!voucherCode) return;
        setValidatingVoucher(true);
        try {
            const res = await api.post('/vouchers/validate', {
                code: voucherCode,
                order_amount: subtotal
            });
            setVoucherStatus(res.data);
            if (res.data.valid) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (err: any) {
            setVoucherStatus({
                valid: false,
                message: err.response?.data?.error || err.response?.data?.message || 'Mã giảm giá không hợp lệ',
                discount_amount: 0
            });
            toast.error(err.response?.data?.error || err.response?.data?.message || 'Lỗi áp dụng mã');
        } finally {
            setValidatingVoucher(false);
        }
    };

    const handleCheckout = async () => {
        if (!address || !phone) {
            toast.error('Vui lòng điền đủ thông tin giao hàng');
            return;
        }

        setCheckoutLoading(true);
        try {
            const orderData = {
                items: items.map(i => ({
                    product_id: i.product_id,
                    quantity: i.quantity
                })),
                shipping_address: { address, phone },
                payment_method: paymentMethod,
                voucher_code: (voucherStatus?.valid && voucherCode) ? voucherCode : undefined
            };
            await api.post('/orders', orderData);
            clearCart();
            setIsSuccess(true);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Lỗi khi đặt hàng');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto py-20 px-4 text-center max-w-lg">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-green-100">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-green-800 mb-3">Đặt hàng thành công!</h2>
                    <p className="text-muted-foreground mb-8">Cảm ơn bạn đã mua sắm tại Vị Quê. Đơn hàng của bạn đang được xử lý.</p>
                    <Link href="/products">
                        <Button className="w-full bg-primary hover:bg-orange-700 text-white rounded-full h-12 text-lg shadow-lg shadow-orange-200" onClick={() => setIsSuccess(false)}>
                            Tiếp tục mua sắm
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto py-20 px-4 text-center max-w-lg">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-orange-100">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-primary opacity-50" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-orange-950 mb-3">Giỏ hàng trống</h2>
                    <p className="text-muted-foreground mb-8">Bạn chưa chọn đặc sản nào. Hãy quay lại cửa hàng để khám phá nhé.</p>
                    <Link href="/products">
                        <Button className="w-full bg-primary hover:bg-orange-700 text-white rounded-full h-12 text-lg shadow-lg shadow-orange-200">
                            Khám phá sản phẩm
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-serif font-bold text-orange-950 mb-8">Giỏ hàng của bạn</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.product_id} className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-orange-100 flex gap-4 sm:gap-6 items-center">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-orange-50 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col sm:flex-row justify-between h-full">
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="font-serif font-bold text-lg sm:text-xl text-orange-950 mb-1">{item.name}</h3>
                                    <p className="text-primary font-bold">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-4">
                                    <div className="flex items-center bg-orange-50 rounded-full border border-orange-100 h-10">
                                        <button
                                            onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                                            className="w-10 h-full flex items-center justify-center text-orange-950 hover:text-primary transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            className="w-10 h-full flex items-center justify-center text-orange-950 hover:text-primary transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.product_id)}
                                        className="text-red-400 hover:text-red-600 transition-colors p-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-orange-100 sticky top-24">
                        <h3 className="text-xl font-serif font-bold text-orange-950 mb-6">Thông tin giao hàng</h3>

                        <div className="space-y-4 mb-6">
                            <Input
                                placeholder="Địa chỉ giao hàng"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="bg-orange-50/50 border-orange-100 h-11 rounded-xl"
                            />
                            <Input
                                placeholder="Số điện thoại liên hệ"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="bg-orange-50/50 border-orange-100 h-11 rounded-xl"
                            />
                        </div>

                        <div className="mb-6">
                            <h4 className="font-serif font-bold text-orange-950 mb-3">Phương thức thanh toán</h4>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                                    />
                                    <span className="text-sm text-slate-700">Thanh toán khi nhận hàng (COD)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="banking"
                                        checked={paymentMethod === 'banking'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                                    />
                                    <span className="text-sm text-slate-700">Chuyển khoản / Quét mã QR</span>
                                </label>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-serif font-bold text-orange-950 mb-3">Mã giảm giá</h4>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nhập mã ưu đãi..."
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                    className="bg-orange-50/50 border-orange-100 h-11 rounded-xl uppercase"
                                />
                                <Button
                                    onClick={handleApplyVoucher}
                                    disabled={!voucherCode || validatingVoucher}
                                    variant="outline"
                                    className="h-11 rounded-xl border-orange-200 text-orange-900 hover:bg-orange-100"
                                >
                                    {validatingVoucher ? "..." : "Áp dụng"}
                                </Button>
                            </div>
                            {voucherStatus && !voucherStatus.valid && (
                                <p className="text-sm text-red-500 mt-2">{voucherStatus.message}</p>
                            )}
                            {voucherStatus?.valid && (
                                <p className="text-sm text-green-600 font-medium mt-2">{voucherStatus.message}</p>
                            )}
                        </div>

                        <div className="space-y-4 mb-6 text-sm text-slate-600">
                            <div className="flex justify-between">
                                <span>Tạm tính ({items.length} sản phẩm)</span>
                                <span className="font-medium text-orange-950">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span>Giảm giá</span>
                                    <span className="text-green-600 font-medium">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600 font-medium">Miễn phí</span>
                            </div>
                            <div className="border-t border-orange-100 pt-4 flex justify-between items-center">
                                <span className="font-bold text-lg text-orange-950">Tổng cộng</span>
                                <span className="font-bold text-2xl text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            disabled={checkoutLoading}
                            className="w-full bg-primary hover:bg-orange-700 text-white rounded-full h-14 text-lg font-bold shadow-lg shadow-orange-200 transition-all hover:-translate-y-1"
                        >
                            {checkoutLoading ? 'Đang xử lý...' : (
                                <>Đặt hàng ngay <ArrowRight className="ml-2 w-5 h-5" /></>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
