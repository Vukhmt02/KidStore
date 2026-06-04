import { Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

export default function Cart() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const shipping = items.length > 0 ? 25000 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <section className="container-page py-12">
        <EmptyState
          title="Giỏ hàng đang trống"
          description="Chọn vài món thật xinh cho bé rồi quay lại thanh toán nhé."
          actionLabel="Mua sắm ngay"
          onAction={() => navigate("/products")}
        />
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <h1 className="section-title">Giỏ hàng</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.key} className="grid gap-4 rounded-[1.75rem] border border-cocoa/10 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]">
              <img src={item.image} alt={item.name} className="aspect-square w-full rounded-3xl object-cover sm:w-28" />
              <div>
                <h2 className="font-bold text-cocoa">{item.name}</h2>
                <p className="mt-1 text-sm text-cocoa/65">
                  Size {item.size} · {item.color}
                </p>
                <p className="mt-3 font-black text-berry">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-cocoa transition hover:text-berry"
                  onClick={() => removeFromCart(item.key)}
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 size={17} />
                </button>
                <div className="flex h-11 items-center rounded-full border border-cocoa/10 bg-cream">
                  <button type="button" className="px-3" onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                    <Minus size={15} />
                  </button>
                  <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button type="button" className="px-3" onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-cocoa">Tóm tắt đơn hàng</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between text-cocoa/70">
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-cocoa/70">
              <span>Phí giao hàng</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="border-t border-cocoa/10 pt-4">
              <div className="flex justify-between text-lg font-black text-cocoa">
                <span>Tổng cộng</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          <Link to="/checkout">
            <Button className="mt-6 w-full" size="lg">
              Thanh toán
            </Button>
          </Link>
        </aside>
      </div>
    </section>
  );
}
