import { Metadata } from 'next';
import { Scale, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Điều khoản sử dụng | Vị Quê',
    description: 'Thỏa thuận và điều khoản khi sử dụng nền tảng Vị Quê',
};

export default function TermsOfUsePage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-orange-950 mb-6 border-b border-orange-200 pb-4">
                Điều Khoản Sử Dụng
            </h1>

            <div className="prose prose-orange max-w-none prose-p:text-slate-700">
                <p className="text-lg leading-relaxed mb-8">
                    Chào mừng bạn đến với <strong>Vị Quê</strong> - Nền tảng kết nối trực tiếp nông sản và đặc sản Miền Tây đến tay người tiêu dùng.
                    Khi truy cập và sử dụng website này, bạn đồng ý tuân thủ và chịu ràng buộc bởi các <em>Điều Khoản Sử Dụng</em> dưới đây.
                </p>

                <h2 className="text-2xl font-bold text-orange-900 mt-8 mb-4">1. Tài Khoản Người Dùng</h2>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>Người dùng cần cung cấp thông tin chính xác khi đăng ký tài khoản (User hoặc Seller).</li>
                    <li>Bạn có trách nhiệm bảo mật mật khẩu và tài khoản của mình. Mọi hoạt động phát sinh từ tài khoản của bạn sẽ do bạn chịu trách nhiệm.</li>
                    <li>Vị Quê có quyền khóa hoặc tạm ngưng tài khoản nếu phát hiện dấu hiệu lừa đảo, phá hoại hoặc vi phạm chính sách cộng đồng.</li>
                </ul>

                <h2 className="text-2xl font-bold text-orange-900 mt-8 mb-4">2. Trách Nhiệm Của Nền Tảng Vị Quê</h2>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>Đóng vai trò là cầu nối thương mại điện tử trung gian, hỗ trợ hiển thị thông tin, thanh toán và kết nối vận chuyển.</li>
                    <li>Chúng tôi cam kết bảo vệ dữ liệu cá nhân của người dùng theo đúng quy định pháp luật sở tại.</li>
                    <li>Ban quản trị sẽ kiểm duyệt gắt gao thông tin người bán để đảm bảo tính minh bạch, tuy nhiên không thể chịu trách nhiệm 100% trong trường hợp phát sinh tranh chấp dân sự ngầm giữa hai bên. Hệ thống sẽ đứng ra phân xử theo quy tắc minh bạch nhất.</li>
                </ul>

                <h2 className="text-2xl font-bold text-orange-900 mt-8 mb-4">3. Quy Tắc Đối Với Người Bán</h2>
                <div className="bg-slate-50 p-6 rounded-xl mb-6 border border-slate-200">
                    <p className="mb-2">Người bán (Sellers) khi đăng bài phải cam kết:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Không bán hàng giả, hàng nhái, hàng cấm theo quy định của pháp luật Việt Nam.</li>
                        <li>Mô tả trung thực tình trạng hàng hóa, khối lượng và hình ảnh. Việc lạm dụng tính năng đăng sản phẩm để lừa đảo sẽ bị xử lý tận gốc.</li>
                        <li>Có thái độ tôn trọng, chuyên nghiệp khi giải quyết khiếu nại (nếu có) từ người mua.</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold text-orange-900 mt-8 mb-4">4. Quyền Sở Hữu Trí Tuệ</h2>
                <p className="mb-6">
                    Mọi nội dung, hình ảnh thiết kế logo, tài liệu trên website Vị Quê (không bao gồm hình ảnh do người bán tự đăng tải) thuộc bản quyền của đội ngũ phát triển Vị Quê. Nghiêm cấm mọi hành vi sao chép, tái xuất bản nền tảng dưới một tên gọi khác với mục đích trục lợi.
                </p>

                <h2 className="text-2xl font-bold text-orange-900 mt-8 mb-4">5. Thay Đổi Điều Khoản</h2>
                <p className="mb-6">
                    Vị Quê có quyền sửa đổi các Điều Khoản Sử Dụng này bất cứ lúc nào để phù hợp với quy định của pháp luật và xu hướng hoạt động của nền tảng. Các thay đổi sẽ có hiệu lực ngay khi được cập nhật lên trang này. Việc người dùng tiếp tục sử dụng website đồng nghĩa với việc chấp thuận các thay đổi đó.
                </p>

                <div className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500 flex items-center justify-between">
                    <span>Phiên bản: 1.0.0</span>
                    <span>Cập nhật lần cuối: Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</span>
                </div>
            </div>
        </div>
    );
}
