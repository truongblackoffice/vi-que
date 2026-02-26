import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Truck, ShieldCheck, Leaf } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
    return (
        <div className="w-full flex flex-col">
            {/* Hero Section */}
            <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-950/80 via-orange-950/50 to-transparent z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596704017254-9b121068fb29?q=80&w=2500&auto=format&fit=crop")' }}
                />

                <div className="container relative z-20 px-4 h-full flex flex-col justify-center">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-4 shadow-xl">
                            <Leaf className="w-4 h-4 text-primary" />
                            <span>Sản phẩm chứng nhận OCOP</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] font-serif drop-shadow-xl">
                            Đặc sản thật<br /><span className="text-primary italic">Vị quê nhà</span>
                        </h1>
                        <p className="text-lg md:text-xl text-orange-50/90 leading-relaxed max-w-xl font-light">
                            Tinh hoa nông sản Miền Tây - Mang hương vị quê cha đất tổ từ Tiền Giang & Đồng Tháp đến tận gian bếp gia đình bạn.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-6">
                            <Link href="/products">
                                <Button size="lg" className="bg-primary hover:bg-orange-700 text-white rounded-full px-8 h-14 text-lg font-medium shadow-xl shadow-orange-900/40 transition-all hover:-translate-y-1">
                                    Khám phá ngay
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-medium bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/30 backdrop-blur-md transition-all hover:-translate-y-1">
                                    Trở thành người bán
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]">
                <div className="container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                        <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-orange-50/80 transition-all duration-300 group hover:-translate-y-2 border border-transparent hover:border-orange-100">
                            <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <Leaf className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif text-orange-950">100% Tự Nhiên</h3>
                            <p className="text-muted-foreground leading-relaxed">Sản phẩm từ nông trại địa phương, được chăm sóc kỹ lưỡng, không sử dụng hoá chất độc hại.</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-orange-50/80 transition-all duration-300 group hover:-translate-y-2 border border-transparent hover:border-orange-100">
                            <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <Truck className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif text-orange-950">Giao Hàng Nhanh</h3>
                            <p className="text-muted-foreground leading-relaxed">Vận chuyển hoả tốc 24h trong khu vực Nam Bộ, đảm bảo độ tươi mới tuyệt đối.</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-orange-50/80 transition-all duration-300 group hover:-translate-y-2 border border-transparent hover:border-orange-100">
                            <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif text-orange-950">Đảm Bảo Chất Lượng</h3>
                            <p className="text-muted-foreground leading-relaxed">Chứng nhận vệ sinh an toàn thực phẩm VSATTP trên mọi mặt hàng đăng bán.</p>
                        </div>
                    </div>
                </div>
            </section>

            <FeaturedProducts />

            {/* Featured Categories */}
            <section className="py-24 bg-orange-50/40">
                <div className="container px-4">
                    <div className="flex items-end justify-between mb-16">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-orange-950 tracking-tight">Danh Mục Nổi Bật</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl font-light">Những tinh hoa nông sản, món ngon trứ danh được bà con Miền Tây tâm huyết tạo nên.</p>
                        </div>
                        <Link href="/products" className="hidden sm:inline-flex items-center text-primary bg-white px-6 py-3 rounded-full hover:bg-orange-100 hover:text-orange-950 font-medium group transition-all shadow-sm">
                            Xem tất cả <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { name: "Trái Cây Tươi", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop", count: "12" },
                            { name: "Mắm & Khô", img: "https://images.unsplash.com/photo-1627907228175-1011884ea892?q=80&w=800&auto=format&fit=crop", count: "8" },
                            { name: "Bánh Kẹo Trứ Danh", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop", count: "15" },
                            { name: "Ẩm Thực Xứ Dừa", img: "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=800&auto=format&fit=crop", count: "20" }
                        ].map((cat, i) => (
                            <Link href={`/products?category=${i + 1}`} key={cat.name} className="group relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-[3/4] block shadow-md hover:shadow-2xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity z-10" />
                                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                                <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <h3 className="text-2xl font-bold text-white mb-2 font-serif tracking-wide">{cat.name}</h3>
                                    <div className="flex items-center text-primary font-medium text-sm bg-black/40 w-fit px-3 py-1 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <span>{cat.count} sản phẩm</span>
                                        <ArrowRight className="w-3 h-3 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 sm:hidden flex justify-center">
                        <Link href="/products">
                            <Button variant="outline" className="rounded-full px-8 bg-white shadow-sm border-orange-200 text-orange-950 font-medium">
                                Xem tất cả danh mục
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
