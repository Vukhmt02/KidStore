import { BarChart3, Boxes, FolderTree, Home, LogOut, Menu, Package, ShoppingCart, Users, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const adminNav = [
  { label: "Tong quan", href: "/admin", icon: BarChart3 },
  { label: "San pham", href: "/admin/products", icon: Package },
  { label: "Don hang", href: "/admin/orders", icon: ShoppingCart },
  { label: "Khach hang", href: "/admin/customers", icon: Users },
  { label: "Danh muc", href: "/admin/categories", icon: FolderTree }
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
      isActive ? "bg-berry text-white shadow-soft" : "text-cocoa/70 hover:bg-cream hover:text-cocoa"
    }`;

  return (
    <div className="min-h-screen bg-[#f7fbfb] text-cocoa">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-cocoa/10 bg-white p-5 shadow-soft transition lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-berry text-lg font-black text-white">
              K
            </span>
            <div>
              <p className="text-lg font-black">KidStore</p>
              <p className="text-xs font-semibold text-cocoa/50">Staff Panel</p>
            </div>
          </Link>
          <button className="rounded-full p-2 text-cocoa lg:hidden" type="button" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 grid gap-2">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.href} to={item.href} end={item.href === "/admin"} className={navClass} onClick={() => setOpen(false)}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 grid gap-2">
          <Link to="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-cocoa/70 hover:bg-cream">
            <Home size={18} />
            Ve website
          </Link>
          <Link to="/login" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-cocoa/70 hover:bg-cream">
            <LogOut size={18} />
            Dang xuat
          </Link>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-40 bg-cocoa/30 lg:hidden" type="button" onClick={() => setOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-cocoa/10 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button className="rounded-full bg-cream p-3 text-cocoa lg:hidden" type="button" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-cocoa/55">Quan ly nhan vien</p>
              <h1 className="text-xl font-black text-cocoa">KidStore Admin</h1>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-cream px-4 py-2">
              <Boxes size={18} className="text-berry" />
              <span className="text-sm font-bold">Staff Demo</span>
            </div>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
