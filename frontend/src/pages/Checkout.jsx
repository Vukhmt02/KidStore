import { CreditCard, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [errors, setErrors] = useState({});
  const shipping = items.length > 0 ? 25000 : 0;
  const total = subtotal + shipping;

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const requiredFields = ["name", "phone", "address"];
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (!form.get(field)) nextErrors[field] = "Không được để trống";
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      clearCart();
      navigate("/");
    }
  };

  if (items.length === 0) {
    return (
      <section className="container-page py-12">
        <EmptyState
          title="Chưa có sản phẩm để thanh toán"
          description="Giỏ hàng của bạn đang trống."
          actionLabel="Quay lại mua sắm"
          onAction={() => navigate("/products")}
        />
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <h1 className="section-title">Thanh toán</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="rounded-[2rem] border border-cocoa/10 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 text-cocoa">
            <MapPin size={20} />
            <h2 className="text-xl font-black">Thông tin giao hàng</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="Họ tên" name="name" placeholder="Nguyễn Minh An" error={errors.name} />
            <Input label="Số điện thoại" name="phone" placeholder="0909 123 456" error={errors.phone} />
            <Input label="Địa chỉ" name="address" placeholder="Số nhà, phường, quận" error={errors.address} className="sm:col-span-2" />
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-cocoa">Ghi chú</span>
              <textarea
                name="note"
                rows="4"
                placeholder="Thời gian giao hàng mong muốn..."
                className="w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-berry focus:ring-4 focus:ring-berry/10"
              />
            </label>
          </div>

          <div className="mt-8 flex items-center gap-2 text-cocoa">
            <CreditCard size={20} />
            <h2 className="text-xl font-black">Phương thức thanh toán</h2>
          </div>
          <div className="mt-4 grid gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-cocoa/10 bg-cream p-4 text-sm font-semibold">
              <input type="radio" name="payment" defaultChecked className="accent-berry" />
              Thanh toán khi nhận hàng
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-cocoa/10 bg-white p-4 text-sm font-semibold">
              <input type="radio" name="payment" className="accent-berry" />
              Chuyển khoản ngân hàng
            </label>
          </div>

          <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
            Đặt hàng
          </Button>
        </form>

        <aside className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-cocoa">Đơn hàng</h2>
          <div className="mt-5 grid gap-4">
            {items.map((item) => (
              <div key={item.key} className="flex gap-3">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-cocoa">{item.name}</p>
                  <p className="text-xs text-cocoa/60">x{item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-berry">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-cocoa/10 pt-5 text-sm">
            <div className="flex justify-between text-cocoa/70">
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-3 flex justify-between text-cocoa/70">
              <span>Phí giao hàng</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-black text-cocoa">
              <span>Tổng</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
