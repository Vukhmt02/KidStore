import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function Banner() {
  return (
    <section className="container-page py-10">
      <div className="grid overflow-hidden rounded-[2rem] bg-mint shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-8 sm:p-10 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-cocoa">
            <Sparkles size={16} />
            Ưu đãi mùa tựu trường
          </div>
          <h2 className="mt-5 max-w-xl text-3xl font-extrabold tracking-normal text-cocoa sm:text-4xl">
            Giảm đến 30% cho set đồ đi học mới
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-cocoa/75 sm:text-base">
            Chọn outfit mềm mại, bền đẹp và dễ giặt cho bé tự tin mỗi ngày.
          </p>
          <Link to="/products" className="mt-7 inline-flex">
            <Button>Mua ngay</Button>
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80"
          alt="Bộ sưu tập quần áo trẻ em"
          className="h-72 w-full object-cover lg:h-full"
        />
      </div>
    </section>
  );
}
