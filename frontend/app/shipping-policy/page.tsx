import { Metadata } from 'next';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Chính sách vận chuyển hoả tốc | Vị Quê',
    description: 'Chính sách giao hàng nhanh chóng, đảm bảo độ tươi ngon của nông sản',
};

export default function ShippingPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-orange-950 mb-6 border-b border-orange-200 pb-4">
                Chính Sách Vận Chuyển Hỏa Tốc
            </h1>

            <div className="prose prose-orange max-w-none prose-p:text-slate-700">
                <p className="text-lg leading-relaxed mb-8">
                    Tại <strong>Vị Quê</strong>, chúng tôi hiểu rằng độ tươi ngon là yếu tố sống còn của nông sản và đặc sản Miền Tây.
                    Vì vậy, chúng tôi tự hào cung cấp dịch vụ <em>Vận Chuyển Hỏa Tốc</em> nhằm đưa sản phẩm từ nhà vườn đến tay bạn một cách nhanh chóng và trọn vẹn nhất.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-orange-50 p-6 rounded-2xl flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full text-primary shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-orange-900 mb-2">Giao Hàng Trong 2 Giờ</h3>
                            <p className="text-slate-600">Áp dụng cho nội thành TP.HCM và các khu vực lân cận trung tâm trung chuyển. Nông sản tươi được giao ngay sau khi thu hoạch.</p>
                        </div>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-2xl flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full text-primary shrink-0">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-orange-900 mb-2">Giao Hàng Trong Ngày</h3>
                            <p className="text-slate-600">Áp dụng cho các sản phẩm khô, chế biến sẵn hoặc đơn hàng giao đến các tỉnh thành có tuyến xe cố định trong mạng lưới Vị Quê.</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-orange-900 mt-10 mb-4 flex items-center gap-2">
                    <MapPin className="text-primary" /> Khu Vực Phủ Sóng
                </h2>
                <ul className="list-disc pl-6 space-y-2 mb-8">
                    <li><strong>Khu vực 1 (Hỏa tốc 2H):</strong> TP.HCM (Nội thành), TP. Mỹ Tho, TP. Cần Thơ.</li>
                    <li><strong>Khu vực 2 (Giao trong ngày):</strong> Các tỉnh ĐBSCL lân cận và các huyện ngoại thành TP.HCM.</li>
                    <li><strong>Khu vực 3 (Giao tiêu chuẩn 1-2 ngày):</strong> Áp dụng cho đặc sản khô giao toàn quốc. Cước phí tính theo đơn vị vận chuyển đối tác.</li>
                </ul>

                <h2 className="text-2xl font-bold text-orange-900 mt-10 mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-primary" /> Bảo Đảm Trong Quá Trình Vận Chuyển
                </h2>
                <p className="mb-4">
                    Tất cả các đơn hàng tươi sống (như trái cây, rau củ, thủy hải sản) đều được đóng gói theo tiêu chuẩn nghiêm ngặt:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-8">
                    <li>Sử dụng thùng xốp/túi giữ nhiệt cho các sản phẩm cần duy trì nhiệt độ.</li>
                    <li>Có lớp chống sốc đặc biệt dành cho trái cây dễ dập nát (bưởi lột sẵn, dâu, nho...).</li>
                    <li>Xe vận chuyển chuyên dụng của Vị Quê được trang bị hệ thống làm mát tiêu chuẩn.</li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-8">
                    <p className="text-yellow-800 text-sm font-medium">
                        <strong>Lưu ý:</strong> Thời gian giao hàng có thể bị ảnh hưởng bởi các yếu tố bất khả kháng như thời tiết xấu, dịch bệnh hoặc các ngày Lễ/Tết cao điểm. Vị Quê sẽ luôn theo dõi sát sao và thông báo kịp thời đến quý khách.
                    </p>
                </div>
            </div>
        </div>
    );
}
