import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Layers, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function CategoriesTableAdmin() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCat, setCurrentCat] = useState({ id: 0, name: '', slug: '', description: '' });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            toast.error('Lỗi khi tải danh sách danh mục');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsHydrated(true);
        fetchCategories();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/categories/${currentCat.id}`, currentCat);
                toast.success('Cập nhật thành công');
            } else {
                await api.post('/admin/categories', currentCat);
                toast.success('Thêm danh mục thành công');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn XÓA danh mục này?')) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            toast.success('Đã xóa danh mục thành công');
            fetchCategories();
        } catch (err) {
            toast.error('Có lỗi xảy ra khi xóa');
            console.error(err);
        }
    };

    const openEdit = (cat: any) => {
        setCurrentCat(cat);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setCurrentCat({ id: 0, name: '', slug: '', description: '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    if (!isHydrated) return null;
    if (loading) return <div className="p-8 text-center text-slate-500">Đang tải biểu mẫu...</div>;

    return (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Quản lý Danh mục</h3>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Thêm danh mục
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-700 text-sm border-b">
                        <tr>
                            <th className="p-4 font-medium pl-6">ID</th>
                            <th className="p-4 font-medium">Tên danh mục</th>
                            <th className="p-4 font-medium">Đường dẫn tĩnh (Slug)</th>
                            <th className="p-4 font-medium text-right pr-6">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c: any) => (
                            <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                <td className="p-4 pl-6 font-medium text-slate-900">#{c.id}</td>
                                <td className="p-4 font-bold text-slate-800">{c.name}</td>
                                <td className="p-4 text-slate-500">{c.slug}</td>
                                <td className="p-4 text-right pr-6 flex justify-end gap-2">
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md animate-in fade-in zoom-in-95 duration-200 p-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-xl font-bold text-slate-900">{isEditing ? 'Sửa danh mục' : 'Thêm mới danh mục'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCat.name}
                                    onChange={(e) => setCurrentCat({ ...currentCat, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Đường dẫn (Slug)</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCat.slug}
                                    onChange={(e) => setCurrentCat({ ...currentCat, slug: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    placeholder="vd: trai-cay-tuoi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 max-h-48 resize-y"
                                    value={currentCat.description}
                                    onChange={(e) => setCurrentCat({ ...currentCat, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="pt-4 flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium">{isEditing ? 'Lưu thay đổi' : 'Tạo mới'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
