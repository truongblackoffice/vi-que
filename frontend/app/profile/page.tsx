"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type ProfileFormData = {
    name: string;
    phone: string;
    email: string;
};

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProfileFormData>();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/users/me");
                const userData = res.data;
                setValue("name", userData.name || "");
                setValue("phone", userData.phone || "");
                setValue("email", userData.email || ""); // read only
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Không thể lấy thông tin người dùng");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [setValue, setUser]);

    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            const res = await api.put("/users/me", {
                name: data.name,
                phone: data.phone,
            });
            setUser(res.data);
            toast.success("Cập nhật hồ sơ thành công");
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const msg = error.response?.data?.error || "Đã xảy ra lỗi khi cập nhật";
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold font-serif text-slate-800 mb-2">Hồ sơ của tôi</h1>
            <p className="text-slate-500 mb-8 border-b border-slate-100 pb-4">
                Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tên đầy đủ *
                    </label>
                    <input
                        {...register("name", {
                            required: "Vui lòng nhập tên đầy đủ",
                            minLength: { value: 2, message: "Tên phải dài hơn 2 ký tự" },
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                        placeholder="Nhập tên của bạn"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                    </label>
                    <input
                        {...register("email")}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-2">Email không thể thay đổi sau khi đăng ký.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Số điện thoại
                    </label>
                    <input
                        {...register("phone", {
                            pattern: {
                                value: /^[0-9]{10,11}$/,
                                message: "Số điện thoại không hợp lệ",
                            },
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                        placeholder="Ví dụ: 0912345678"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm focus:ring-4 focus:ring-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}
