import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 bg-cocoa text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-berry text-lg font-black">K</span>
            <span className="text-xl font-black">KidStore</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            Quần áo trẻ em mềm mại, đáng yêu và dễ phối cho bé từ sơ sinh đến 7 tuổi.
          </p>
          <div className="mt-5 flex gap-3">
            <a className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-berry" href="#" aria-label="Facebook">
              <MessageCircle size={18} />
            </a>
            <a className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-berry" href="#" aria-label="Instagram">
              <Camera size={18} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Mua sắm</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link to="/products" className="hover:text-white">Sản phẩm mới</Link>
            <Link to="/products?category=baby" className="hover:text-white">Bé sơ sinh</Link>
            <Link to="/products?category=accessories" className="hover:text-white">Phụ kiện</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Hỗ trợ</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link to="/cart" className="hover:text-white">Giỏ hàng</Link>
            <Link to="/checkout" className="hover:text-white">Thanh toán</Link>
            <Link to="/login" className="hover:text-white">Tài khoản</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Liên hệ</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <p className="flex gap-3"><MapPin size={18} /> 24 Pastel Street, TP.HCM</p>
            <p className="flex gap-3"><Phone size={18} /> 0909 123 456</p>
            <p className="flex gap-3"><Mail size={18} /> hello@kidstore.vn</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © 2026 KidStore. Giao diện minh họa.
      </div>
    </footer>
  );
}
