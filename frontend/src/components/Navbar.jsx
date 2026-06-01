import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Giỏ hàng", href: "/cart" },
  { label: "Admin", href: "/admin" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalQuantity } = useCart();

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? "bg-peach text-cocoa" : "text-cocoa/75 hover:bg-white hover:text-cocoa"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-cream/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-berry text-lg font-black text-white">
            K
          </span>
          <span className="text-xl font-black tracking-normal text-cocoa">KidStore</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/products"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cocoa transition hover:text-berry"
            aria-label="Tìm kiếm"
          >
            <Search size={19} />
          </Link>
          <Link
            to="/login"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cocoa transition hover:text-berry"
            aria-label="Tài khoản"
          >
            <User size={19} />
          </Link>
          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-cocoa text-white transition hover:bg-berry"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag size={19} />
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry px-1 text-xs font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cocoa md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Mở menu"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-cocoa/10 bg-cream px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} className={navClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
              Đăng nhập
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
