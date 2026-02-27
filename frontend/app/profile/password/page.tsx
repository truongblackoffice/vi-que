"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, KeyRound } from "lucide-react";
import api from "@/lib/api";

type PasswordFormData = {
    old_password: string;
    new_password: string;
    confirm_password: string;
};

export default function ChangePasswordPage() {
    const [isSaving, setIsSaving] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<PasswordFormData>();

    const newPassword = watch("new_password");

    const onSubmit = async (data: PasswordFormData) => {
        setIsSaving(true);
        try {
            await api.put("/users/me/password", {
                old_password: data.old_password,
                new_password: data.new_password,
            });
            toast.success("Đổi mật khẩu thành công!");
            reset();
        } catch (error: any) {
            console.error("Failed to change password", error);
            const msg = error.response?.data?.error || "Đã xảy ra lỗi khi đổi mật khẩu";
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold font-serif text-slate-800 mb-2">Đổi Mật Khẩu</h1>
            <p className="text-slate-500 mb-8 border-b border-slate-100 pb-4">
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Mật khẩu hiện tại *
                    </label>
                    <input
                        type="password"
                        {...register("old_password", {
                            required: "Vui lòng nhập mật khẩu hiện tại",
                            minLength: { value: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                    {errors.old_password && (
                        <p className="mt-1 text-sm text-red-500">{errors.old_password.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Mật khẩu mới *
                    </label>
                    <input
                        type="password"
                        {...register("new_password", {
                            required: "Vui lòng nhập mật khẩu mới",
                            minLength: { value: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                        placeholder="Nhập mật khẩu mới"
                    />
                    {errors.new_password && (
                        <p className="mt-1 text-sm text-red-500">{errors.new_password.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Xác nhận mật khẩu mới *
                    </label>
                    <input
                        type="password"
                        {...register("confirm_password", {
                            required: "Vui lòng xác nhận mật khẩu mới",
                            validate: (val: string) => {
                                if (watch("new_password") != val) {
                                    return "Mật khẩu xác nhận không khớp";
                                }
                            },
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                        placeholder="Nhập lại mật khẩu mới"
                    />
                    {errors.confirm_password && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirm_password.message}</p>
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
                            <KeyRound className="w-5 h-5" />
                        )}
                        {isSaving ? "Đang lưu..." : "Lưu mật khẩu"}
                    </button>
                </div>
            </form>
        </div>
    );
}
