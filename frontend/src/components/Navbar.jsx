import { LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { authService } from "../services/authService";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Giỏ hàng", href: "/cart" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [profileError, setProfileError] = useState("");
  const { totalQuantity } = useCart();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const syncUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setCurrentUser(null);
        setProfileOpen(false);
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        localStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);
        setProfileError("");
      } catch {
        setCurrentUser(getStoredUser());
      }
    };

    syncUser();
    window.addEventListener("authChanged", syncUser);

    return () => window.removeEventListener("authChanged", syncUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? "bg-peach text-cocoa" : "text-cocoa/75 hover:bg-white hover:text-cocoa"
    }`;

  const handleProfileClick = async () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    if (!profileOpen) {
      try {
        const user = await authService.getCurrentUser();
        localStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);
        setProfileError("");
      } catch (error) {
        setProfileError(error.message || "Khong the tai thong tin tai khoan.");
      }
    }

    setProfileOpen((value) => !value);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("authChanged"));
      setCurrentUser(null);
      setProfileOpen(false);
      navigate("/login");
    }
  };

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
            aria-label="Tim kiem"
          >
            <Search size={19} />
          </Link>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={handleProfileClick}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cocoa transition hover:text-berry"
              aria-label="Tai khoan"
            >
              <User size={19} />
            </button>

            {profileOpen && currentUser && (
              <div className="absolute right-0 top-14 w-80 rounded-[1.5rem] border border-cocoa/10 bg-white p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-peach text-lg font-black text-cocoa">
                    {getInitials(currentUser.fullName)}
                  </div>
                  <div>
                    <p className="font-black text-cocoa">{currentUser.fullName}</p>
                    <p className="text-sm text-cocoa/60">{currentUser.roleName}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl bg-cream px-4 py-4 text-sm text-cocoa/75">
                  <ProfileRow label="Email" value={currentUser.email} />
                  <ProfileRow label="So dien thoai" value={currentUser.phoneNumber} />
                  <ProfileRow label="Dia chi" value={currentUser.address} />
                </div>

                <Link
                  to="/account"
                  onClick={() => setProfileOpen(false)}
                  className="mt-4 block rounded-full bg-berry px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-cocoa"
                >
                  Xem tai khoan
                </Link>

                {Number(currentUser.role) === 1 && (
                  <Link
                    to="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="mt-4 block rounded-full bg-cocoa px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-berry"
                  >
                    Vao trang quan tri
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-cocoa/10 px-4 py-3 text-sm font-bold text-cocoa transition hover:bg-cream"
                >
                  <LogOut size={16} />
                  Dang xuat
                </button>

                {profileError && <p className="mt-3 text-sm font-semibold text-berry">{profileError}</p>}
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-cocoa text-white transition hover:bg-berry"
            aria-label="Gio hang"
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
          aria-label="Mo menu"
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

            {currentUser ? (
              <>
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-left text-sm font-semibold text-cocoa/75 transition hover:bg-white hover:text-cocoa"
                  onClick={() => {
                    setOpen(false);
                    navigate("/account");
                  }}
                >
                  {currentUser.fullName}
                </button>
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-left text-sm font-semibold text-cocoa/75 transition hover:bg-white hover:text-cocoa"
                  onClick={async () => {
                    setOpen(false);
                    await handleLogout();
                  }}
                >
                  Dang xuat
                </button>
              </>
            ) : (
              <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                Dang nhap
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

function getInitials(fullName) {
  if (!fullName) return "K";

  return fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function ProfileRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cocoa/40">{label}</p>
      <p className="mt-1 font-semibold text-cocoa">{value || "Chua cap nhat"}</p>
    </div>
  );
}
