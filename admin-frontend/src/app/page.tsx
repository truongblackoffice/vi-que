"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { ShieldCheck, Users, Briefcase, LogOut, Package, Activity, ShoppingCart, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

import UsersTable from '@/components/UsersTable';
import ProductsTableAdmin from '@/components/ProductsTableAdmin';
import CategoriesTableAdmin from '@/components/CategoriesTableAdmin';

type TabType = 'overview' | 'users' | 'products' | 'categories' | 'orders';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [metrics, setMetrics] = useState({ total_users: 0, total_products: 0, total_orders: 0, total_revenue: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [metricsRes, ordersRes] = await Promise.all([
          api.get('/admin/metrics'),
          api.get('/admin/orders')
        ]);
        setMetrics(metricsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
        if ((err as any).response?.status === 401 || (err as any).response?.status === 403) {
          toast.error('Phiên đăng nhập hết hạn hoặc không hợp lệ.');
          logout();
          router.push('/login');
        } else {
          toast.error('Gặp lỗi khi truy xuất dữ liệu từ máy chủ.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user, router, logout, isHydrated]);

  const handleLogout = () => {
    logout();
    api.post('/auth/logout').catch(() => { });
    router.push('/login');
  };

  if (!isHydrated) return null;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Bảng điều khiển Quản trị viên</h1>
          <p className="text-slate-500">Môi trường thao tác dữ liệu tập trung (Centralized Panel)</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" /> Đăng xuất
        </button>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('overview')} className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
          <Activity className="w-4 h-4" /> Tổng quan
        </button>
        <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
          <Users className="w-4 h-4" /> Người dùng
        </button>
        <button onClick={() => setActiveTab('products')} className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors ${activeTab === 'products' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
          <Package className="w-4 h-4" /> Sản phẩm
        </button>
        <button onClick={() => setActiveTab('categories')} className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors ${activeTab === 'categories' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
          <Layers className="w-4 h-4" /> Danh mục
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Users className="w-6 h-6" /></div>
              <div><p className="text-slate-500 text-sm">Thành viên</p><p className="text-2xl font-bold text-slate-900">{metrics.total_users}</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><Package className="w-6 h-6" /></div>
              <div><p className="text-slate-500 text-sm">Sản phẩm</p><p className="text-2xl font-bold text-slate-900">{metrics.total_products}</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><ShoppingCart className="w-6 h-6" /></div>
              <div><p className="text-slate-500 text-sm">Đơn hàng</p><p className="text-2xl font-bold text-slate-900">{metrics.total_orders}</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Briefcase className="w-6 h-6" /></div>
              <div><p className="text-slate-500 text-xs">Doanh thu giao thành công</p><p className="text-xl font-bold text-slate-900">{new Intl.NumberFormat('vi-VN').format(metrics.total_revenue)}đ</p></div>
            </div>
          </div>

          {/* RECENT ORDERS TABLE */}
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100"><h3 className="text-xl font-bold text-slate-900">Giao dịch gần đây</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 text-sm border-b">
                  <tr>
                    <th className="p-4 font-medium pl-6">Mã đơn</th>
                    <th className="p-4 font-medium">Khách hàng</th>
                    <th className="p-4 font-medium">Trạng thái</th>
                    <th className="p-4 font-medium text-right pr-6">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((o: any) => (
                    <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-medium text-slate-900">#{o.id}</td>
                      <td className="p-4 text-slate-900 font-medium">{o.buyer?.name || 'Vô danh'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6 font-bold text-slate-900">{new Intl.NumberFormat('vi-VN').format(o.total_amount)}đ</td>
                    </tr>
                  ))}
                  {orders.length === 0 && !loading && (
                    <tr><td colSpan={4} className="p-10 text-center text-slate-500">Hệ thống chưa ghi nhận giao dịch nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS */}
      {activeTab === 'users' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <UsersTable />
        </div>
      )}

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ProductsTableAdmin />
        </div>
      )}

      {/* TAB CONTENT: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CategoriesTableAdmin />
        </div>
      )}

    </div>
  );
}
