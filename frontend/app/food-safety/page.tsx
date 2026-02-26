import { Metadata } from 'next';
import { ShieldCheck, FileText, CheckCircle2, Factory } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Quy định vệ sinh ATTP | Vị Quê',
    description: 'Cam kết tiêu chuẩn An toàn thực phẩm đối với mọi đặc sản tại Vị Quê',
};

export default function FoodSafetyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-orange-950 mb-6 border-b border-orange-200 pb-4">
                Quy Định Vệ Sinh An Toàn Thực Phẩm
            </h1>

            <div className="prose prose-orange max-w-none prose-p:text-slate-700">
                <p className="text-lg leading-relaxed mb-8">
                    Sức khỏe của người tiêu dùng là giá trị cốt lõi mà <strong>Vị Quê</strong> hướng tới. Chúng tôi thiết lập một bộ quy chuẩn nghiêm ngặt về
                    <strong> Vệ Sinh An Toàn Thực Phẩm (VSATTP)</strong> cho tất cả các đối tác nhà vườn, xưởng sản xuất và người bán hoạt động trên nền tảng.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Tiêu Chuẩn Nông Sản Tươi</h3>
                        <p className="text-sm text-slate-600">
                            Mọi nông sản tươi sống (thịt, cá, rau củ quả) phải có nguồn gốc xuất xứ rõ ràng. Khuyến khích kiểm định đạt tiêu chuẩn <strong>VietGAP, GlobalGAP, Hữu Cơ (Organic)</strong>. Không tồn dư thuốc BVTV vượt mức cho phép.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <Factory className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Cơ Sở Sản Xuất</h3>
                        <p className="text-sm text-slate-600">
                            Các sản phẩm đặc sản đã qua chế biến (mắm, lạp xưởng, bánh mứt) bắt buộc phải được sản xuất tại các cơ sở có <strong>Giấy chứng nhận cơ sở đủ điều kiện VSATTP</strong> còn hiệu lực do cơ quan nhà nước cấp.
                        </p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-orange-900 mt-10 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-primary" /> Cam Kết "3 KHÔNG" Từ Vị Quê
                </h2>
                <div className="bg-slate-50 p-6 rounded-xl space-y-4 mb-10">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 text-red-600 p-2 rounded-lg font-bold text-sm">01</div>
                        <div>
                            <h4 className="font-bold text-slate-900">Không chất bảo quản cấm</h4>
                            <p className="text-sm text-slate-600">Tuyệt đối không sử dụng hàn the, formol, thuốc nhuộm nhân tạo độc hại hay bất kỳ hóa chất bảo quản nào bị cấm bởi Bộ Y Tế.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 text-red-600 p-2 rounded-lg font-bold text-sm">02</div>
                        <div>
                            <h4 className="font-bold text-slate-900">Không "treo đầu dê, bán thịt chó"</h4>
                            <p className="text-sm text-slate-600">Hình ảnh, thông tin và chứng nhận sản phẩm trên Vị Quê phải trùng khớp 100% với chất lượng sản phẩm thực tế giao đến tay khách hàng.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 text-red-600 p-2 rounded-lg font-bold text-sm">03</div>
                        <div>
                            <h4 className="font-bold text-slate-900">Không nhập nhằng hạn sử dụng</h4>
                            <p className="text-sm text-slate-600">Luôn giao hàng có niên hạn sử dụng (Date) mới nhất. In rõ ràng Ngày sản xuất và Hạn sử dụng trên từng bao bì sản phẩm chế biến.</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-orange-900 mt-10 mb-4 flex items-center gap-2">
                    <FileText className="text-primary" /> Trách Nhiệm Của Người Bán (Seller)
                </h2>
                <p className="mb-4">
                    Nhà cung cấp khi tham gia bán hàng trên Vị Quê phải tuân thủ và đệ trình các tài liệu sau (nếu áp dụng):
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-8">
                    <li>Giấy phép đăng ký kinh doanh/Hộ kinh doanh.</li>
                    <li>Giấy chứng nhận cơ sở đủ điều kiện An toàn thực phẩm.</li>
                    <li>Bản công bố tiêu chuẩn chất lượng sản phẩm.</li>
                    <li>Kết quả kiểm nghiệm định kỳ từ các viện kiểm nghiệm được công nhận.</li>
                </ul>
                <p>
                    <strong>Hình phạt:</strong> Vị Quê sẽ <em>đình chỉ tài khoản vĩnh viễn</em> và gỡ bỏ toàn bộ sản phẩm nếu phát hiện người bán có hành vi gian lận giấy tờ hoặc cung cấp thực phẩm bẩn, gây hại cho sức khỏe cộng đồng.
                </p>
            </div>
        </div>
    );
}
