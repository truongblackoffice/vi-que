import { Metadata } from 'next';
import { BadgeCheck, RefreshCcw, Handshake, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Cam kết hoàn tiền 100% | Vị Quê',
    description: 'Chính sách bảo hành và hoàn tiền bảo vệ quyền lợi người mua nông sản',
};

export default function RefundPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-orange-950 mb-6 border-b border-orange-200 pb-4">
                Cam Kết Hoàn Tiền 100%
            </h1>

            <div className="prose prose-orange max-w-none prose-p:text-slate-700">
                <p className="text-lg leading-relaxed mb-6">
                    Sự hài lòng và tín nhiệm của bạn là động lực để <strong>Vị Quê</strong> nỗ lực mỗi ngày.
                    Chúng tôi áp dụng chính sách <strong>Hoàn tiền 100%</strong> hoặc <strong>1 đổi 1</strong> để bạn hoàn toàn an tâm khi mua sắm đặc sản tận gốc.
                </p>

                <div className="bg-green-50 rounded-xl p-6 mb-10 border border-green-100 shadow-sm">
                    <h2 className="text-xl font-bold text-green-900 flex items-center gap-2 mb-3">
                        <BadgeCheck className="text-green-600" /> Tự Tin Chất Lượng Vàng
                    </h2>
                    <p className="text-green-800">
                        Nếu sản phẩm bạn nhận được không đúng như mô tả, héo úa, hư hỏng trong quá trình vận chuyển hoặc không đạt chất lượng cam kết,
                        Vị Quê sẽ hoàn lại 100% giá trị đơn hàng hoặc đổi sản phẩm mới tận nơi mà bạn <strong>không phải chịu bất kỳ chi phí nào phát sinh</strong>.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-orange-900 mt-10 mb-4 flex items-center gap-2">
                    <RefreshCcw className="text-primary" /> Điều Kiện Áp Dụng Hoàn Tiền/Đổi Trả
                </h2>
                <div className="space-y-4 mb-8">
                    <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-orange-200 transition-colors">
                        <h3 className="font-bold text-lg mb-1">1. Hàng Tươi Sống (Trái cây, rau củ, hải sản)</h3>
                        <p className="text-sm text-slate-600 mb-2">Vui lòng kiểm tra và phản hồi trong vòng <strong>24 giờ</strong> kể từ lúc nhận hàng thành công.</p>
                        <ul className="text-sm list-disc pl-5 text-slate-600 space-y-1">
                            <li>Sản phẩm bị dập nát, hư hỏng nặng do vận chuyển.</li>
                            <li>Sản phẩm bên trong bị hư, thối (áp dụng bù phần trăm tỷ lệ hư hỏng hoặc hoàn 100% nếu hư toàn bộ).</li>
                            <li>Giao sai loại hàng, sai khối lượng.</li>
                        </ul>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-orange-200 transition-colors">
                        <h3 className="font-bold text-lg mb-1">2. Đặc Sản Khô & Chế Biến Sẵn</h3>
                        <p className="text-sm text-slate-600 mb-2">Hỗ trợ đổi trả trong vòng <strong>07 ngày</strong> kể từ ngày nhận hàng.</p>
                        <ul className="text-sm list-disc pl-5 text-slate-600 space-y-1">
                            <li>Sản phẩm bị mốc, có mùi lạ, quá hạn sử dụng.</li>
                            <li>Bao bì bị rách, hở màng seal làm ảnh hưởng chất lượng bên trong.</li>
                            <li>Sản phẩm giữ nguyên tem mác (nếu lỗi khách quan không phải từ chất lượng).</li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-orange-900 mt-10 mb-4 flex items-center gap-2">
                    <Handshake className="text-primary" /> Quy Trình Xử Lý Nhanh Gọn
                </h2>
                <ol className="list-decimal pl-6 space-y-3 mb-8 bg-slate-50 p-6 rounded-xl">
                    <li><strong>Bước 1:</strong> Bạn quay video hoặc chụp ảnh rõ tình trạng sản phẩm bị lỗi ngay khi mở hộp.</li>
                    <li><strong>Bước 2:</strong> Gửi hình ảnh/video kèm mã đơn hàng đến Zalo bộ phận CSKH "0273.3812.345" hoặc email "support@vique.vn".</li>
                    <li><strong>Bước 3:</strong> Vị Quê tiếp nhận và phản hồi giải pháp (Hoàn tiền hoặc Đổi mới) trong vòng <strong>2-4 giờ làm việc</strong>.</li>
                    <li><strong>Bước 4:</strong> Tiền sẽ được hoàn về tài khoản của bạn trong 24H hoặc sản phẩm mới sẽ được giao hỏa tốc.</li>
                </ol>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-8 flex gap-3">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm font-medium">
                        <strong>Trường hợp từ chối bảo hành:</strong> Vị Quê xin phép từ chối hoàn tiền đối với các trường hợp hương vị không hợp khẩu vị cá nhân tự quan (chua/ngọt quá), hoặc sản phẩm hư hỏng do khách hàng bảo quản sai hướng dẫn (ví dụ: cần bảo quản lạnh nhưng để ở nhiệt độ thường).
                    </p>
                </div>
            </div>
        </div>
    );
}
