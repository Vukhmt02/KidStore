import { ArrowRight, Gift, Sparkles, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function Banner() {
  return (
    <section className="container-page py-10">
      <div className="grid min-h-[420px] overflow-hidden rounded-[2rem] border border-cocoa/10 bg-[#eaf7f1] shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-cocoa">
            <Gift size={16} className="text-berry" />
            Ưu đãi trong tuần
          </div>
          <h2 className="mt-5 max-w-lg text-3xl font-black tracking-normal text-cocoa sm:text-4xl">
            Giảm giá các sét đồ cho bé đi học và đi chơi
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-cocoa/75 sm:text-base">
            Chọn nhanh outfit cho bé với màu sắc dễ mặc, chất vải thoáng và đủ size phổ biến. 
          </p>
          <div className="mt-6 grid max-w-md gap-3 sm:grid-cols-2">
            <BannerPoint icon={Tags} text="Nhiều mẫu đang có sẵn" />
            <BannerPoint icon={Sparkles} text="Chất liệu mềm mại" />
          </div>

          <Link to="/products" className="mt-8 inline-flex">
            <Button size="lg">
              Mua ngay <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
        <div className="relative min-h-[320px] lg:min-h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=85"
            alt="Bo suu tap quan ao tre em"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

function BannerPoint({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-cocoa">
      <Icon size={16} className="text-berry" />
      {text}
    </div>
  );
}
