import { ArrowRight, BadgePercent } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function HeroSection() {
  return (
    <section className="container-page py-8 sm:py-12">
      <div className="grid min-h-[560px] overflow-hidden rounded-[2.25rem] bg-peach shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-bold text-cocoa">
            <BadgePercent size={16} />
            Bộ sưu tập mới đã lên kệ
          </div>
          <h1 className="mt-6 max-w-xl text-4xl font-black tracking-normal text-cocoa sm:text-5xl lg:text-6xl">
            KidStore
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-cocoa/75 sm:text-lg">
            Quần áo trẻ em pastel, mềm mại và tinh tế cho những ngày đi học, đi chơi và ở nhà thật thoải mái.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/products">
              <Button size="lg">
                Khám phá ngay <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/products?category=baby">
              <Button variant="secondary" size="lg">
                Đồ sơ sinh
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            {[
              ["8+", "Mẫu nổi bật"],
              ["4", "Danh mục"],
              ["30%", "Ưu đãi"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl bg-white/60 p-4">
                <p className="text-2xl font-black text-cocoa">{value}</p>
                <p className="mt-1 text-xs font-semibold text-cocoa/65">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[360px]">
          <img
            src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1400&q=80"
            alt="Thời trang trẻ em KidStore"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] bg-white/85 p-5 shadow-soft backdrop-blur">
            <p className="text-sm font-bold text-berry">Cotton mềm, form thoải mái</p>
            <p className="mt-1 text-sm leading-6 text-cocoa/70">Thiết kế dễ phối cho bé vận động suốt ngày.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
