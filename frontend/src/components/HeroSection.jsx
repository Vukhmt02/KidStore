import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function HeroSection() {
  return (
    <section className="container-page py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-cocoa/10 bg-[#fdf1e6] shadow-soft">
        <div className="grid min-h-[600px] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-cocoa shadow-sm">
              <Sparkles size={16} className="text-berry" />
                Bộ sưu tập mới cho bé
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-black tracking-normal text-cocoa sm:text-5xl lg:text-6xl">
                            KidStore
              <span className="block text-berry">Mặc xinh mỗi ngày</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-cocoa/75 sm:text-lg">
              Quan ao tre em mem mai, de phoi va thoai mai cho be di hoc, di choi va o nha.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/products">
                <Button size="lg">
                  Kham pha san pham <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="secondary" size="lg">
                  Xem hang moi
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <HeroStat icon={Truck} title="Giao nhanh" text="Noi thanh 1-2 ngay" />
              <HeroStat icon={ShieldCheck} title="Chat lieu em" text="Cotton thoang mem" />
              <HeroStat icon={Sparkles} title="De doi tra" text="Ho tro doi size" />
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1500&q=85"
              alt="Quan ao tre em KidStore"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdf1e6] via-[#fdf1e6]/20 to-transparent lg:hidden" />
            <div className="absolute bottom-6 left-6 right-6 max-w-sm rounded-[1.5rem] bg-white/90 p-5 shadow-soft backdrop-blur">
              <p className="text-sm font-black text-cocoa">Set do he moi</p>
              <p className="mt-1 text-sm leading-6 text-cocoa/70">
                Mau sac tuoi, form rong vua du cho be van dong ca ngay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white/70 p-4 shadow-sm">
      <Icon size={20} className="text-berry" />
      <p className="mt-3 text-sm font-black text-cocoa">{title}</p>
      <p className="mt-1 text-xs font-semibold text-cocoa/60">{text}</p>
    </div>
  );
}
