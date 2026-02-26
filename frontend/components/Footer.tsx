import Link from 'next/link';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-orange-950 text-orange-50 py-16 mt-20 rounded-t-[3rem] relative z-20">
            <div className="container px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-4 md:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Leaf className="w-8 h-8 text-primary" />
                            <span className="text-3xl font-bold font-serif text-white">Vị Quê</span>
                        </Link>
                        <p className="text-orange-200/80 leading-relaxed text-sm">
                            Hệ sinh thái nông sản và đặc sản Miền Tây kết nối trực tiếp từ nông trại đến bàn ăn gia đình bạn.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Liên Hệ</h4>
                        <ul className="space-y-4 text-orange-200/80 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span>123 Đường Bến Tre, Phường 2, TP. Mỹ Tho, Tiền Giang</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>0273 3812 345</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>chao@vique.vn</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Khám Phá</h4>
                        <ul className="space-y-3 text-orange-200/80 text-sm">
                            <li><Link href="/products" className="hover:text-primary transition-colors">Tất cả Đặc sản</Link></li>
                            <li><Link href="/products?category=1" className="hover:text-primary transition-colors">Trái Cây Hái Tại Vườn</Link></li>
                            <li><Link href="/products?category=2" className="hover:text-primary transition-colors">Đặc Sản Biếu Tặng</Link></li>
                            <li><Link href="/auth/register" className="hover:text-primary transition-colors">Kênh Người Bán</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Chính Sách</h4>
                        <ul className="space-y-3 text-orange-200/80 text-sm">
                            <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Chính sách vận chuyển hoả tốc</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Cam kết hoàn tiền 100%</Link></li>
                            <li><Link href="/food-safety" className="hover:text-primary transition-colors">Quy định vệ sinh ATTP</Link></li>
                            <li><Link href="/terms-of-use" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-orange-900/50 mt-12 pt-8 text-center text-orange-200/60 text-sm flex flex-col items-center">
                    <p>© 2026 Vị Quê. All rights reserved.</p>
                    <p className="mt-2 text-xs">Phát triển với sự tận tâm dành cho nông sản Việt.</p>
                </div>
            </div>
        </footer>
    );
}
