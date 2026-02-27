import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Edit2, X } from 'lucide-react';

export default function UsersTable() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [newRole, setNewRole] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            toast.error('Lỗi khi tải danh sách người dùng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsHydrated(true);
        fetchUsers();
    }, []);

    const openEditRole = (u: any) => {
        setCurrentUser(u);
        setNewRole(u.role);
        setIsEditOpen(true);
    };

    const handleSaveRole = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/admin/users/${currentUser.id}`, { role: newRole });
            toast.success('Thay đổi quyền thành công');
            setIsEditOpen(false);
            fetchUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Lỗi khi đổi quyền người dùng');
        }
    }

    if (!isHydrated) return null;
    if (loading) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu người dùng...</div>;

    return (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Quản lý Tài Khoản</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-700 text-sm border-b">
                        <tr>
                            <th className="p-4 font-medium pl-6">ID</th>
                            <th className="p-4 font-medium">Họ tên / Đơn vị</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Vai trò</th>
                            <th className="p-4 font-medium">Ngày tham gia</th>
                            <th className="p-4 font-medium text-right pr-6">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u: any) => (
                            <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                <td className="p-4 pl-6 font-medium text-slate-900">#{u.id}</td>
                                <td className="p-4 font-semibold text-slate-800">{u.name}</td>
                                <td className="p-4 font-medium text-slate-900">{u.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-700' :
                                        u.role === 'seller' ? 'bg-indigo-100 text-indigo-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-slate-900 text-sm">
                                    {new Date(u.created_at).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="p-4 text-right pr-6 flex justify-end">
                                    <button
                                        onClick={() => openEditRole(u)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Chỉnh sửa quyền"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr><td colSpan={6} className="p-10 text-center text-slate-500">Chưa có dữ liệu.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isEditOpen && currentUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 p-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Phân quyền Tài khoản</h3>
                            <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSaveRole} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tài khoản</label>
                                <input type="text" disabled value={currentUser.email} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò hiện tại</label>
                                <select
                                    className="w-full px-3 py-2 text-slate-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                >
                                    <option value="buyer" className="text-slate-900">BUYER (Người dùng cơ bản)</option>
                                    <option value="seller" className="text-slate-900">SELLER (Nhà cung cấp)</option>
                                    <option value="admin" className="text-slate-900">ADMIN (Quản trị viên)</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
