"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.user);
            toast.success('Đăng nhập thành công!');
            if (res.data.user.role === 'admin') router.push('/admin');
            else if (res.data.user.role === 'seller') router.push('/dashboard');
            else router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-md mx-auto py-20 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-orange-100/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-300" />
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-orange-950 mb-2">Chào mừng trở lại</h1>
                    <p className="text-muted-foreground">Đăng nhập để trải nghiệm Vị Quê trọn vẹn.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-orange-50/50 border-orange-100 focus:border-primary focus:ring-primary/20 transition-all rounded-xl h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Link href="#" className="text-sm text-primary hover:underline font-medium">Quên mật khẩu?</Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-orange-50/50 border-orange-100 focus:border-primary focus:ring-primary/20 transition-all rounded-xl h-11"
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-700 text-white rounded-full h-12 text-lg shadow-lg shadow-orange-200 transition-all">
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    Chưa có tài khoản?{' '}
                    <Link href="/auth/register" className="text-primary font-bold hover:underline">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}
