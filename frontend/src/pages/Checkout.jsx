import { CreditCard, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";
import { useCart } from "../hooks/useCart";
import { orderService } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shipping = items.length > 0 ? 25000 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/checkout",
          message: "Vui long dang nhap de thanh toan."
        }
      });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const nextErrors = {};

    if (!form.get("name")) nextErrors.name = "Khong duoc de trong";
    if (!form.get("phone")) nextErrors.phone = "Khong duoc de trong";
    if (!form.get("address")) nextErrors.address = "Khong duoc de trong";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await orderService.create({
        customerName: form.get("name"),
        phoneNumber: form.get("phone"),
        shippingAddress: form.get("address"),
        note: form.get("note"),
        paymentMethod: form.get("payment") || "COD"
      });

      await clearCart({ syncServer: false });
      navigate("/", { state: { message: "Dat hang thanh cong." } });
    } catch (error) {
      setErrors({
        form: error.message || "Khong the dat hang luc nay."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="container-page py-12">
        <EmptyState
          title="Chua co san pham de thanh toan"
          description="Gio hang cua ban dang trong."
          actionLabel="Quay lai mua sam"
          onAction={() => navigate("/products")}
        />
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <h1 className="section-title">Thanh toan</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="rounded-[2rem] border border-cocoa/10 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 text-cocoa">
            <MapPin size={20} />
            <h2 className="text-xl font-black">Thong tin giao hang</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="Ho ten" name="name" placeholder="Nguyen Minh An" error={errors.name} />
            <Input label="So dien thoai" name="phone" placeholder="0909 123 456" error={errors.phone} />
            <Input label="Dia chi" name="address" placeholder="So nha, phuong, quan" error={errors.address} className="sm:col-span-2" />
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-cocoa">Ghi chu</span>
              <textarea
                name="note"
                rows="4"
                placeholder="Thoi gian giao hang mong muon..."
                className="w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-berry focus:ring-4 focus:ring-berry/10"
              />
            </label>
          </div>

          <div className="mt-8 flex items-center gap-2 text-cocoa">
            <CreditCard size={20} />
            <h2 className="text-xl font-black">Phuong thuc thanh toan</h2>
          </div>
          <div className="mt-4 grid gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-cocoa/10 bg-cream p-4 text-sm font-semibold">
              <input type="radio" name="payment" value="COD" defaultChecked className="accent-berry" />
              Thanh toan khi nhan hang
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-cocoa/10 bg-white p-4 text-sm font-semibold">
              <input type="radio" name="payment" value="BankTransfer" className="accent-berry" />
              Chuyen khoan ngan hang
            </label>
          </div>

          {errors.form && <p className="mt-5 rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{errors.form}</p>}

          <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Dang dat hang..." : "Dat hang"}
          </Button>
        </form>

        <aside className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-cocoa">Don hang</h2>
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
              <span>Tam tinh</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-3 flex justify-between text-cocoa/70">
              <span>Phi giao hang</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-black text-cocoa">
              <span>Tong</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
