import { CheckCircle2, Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import emptyCartMascot from "../assets/empty-cart-mascot.png";
import Button from "../components/Button";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

export function CartStepsHeader({ activeStep = 1 }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 py-4 sm:py-7 text-xs sm:text-sm font-bold tracking-wide">
      <div className={`flex items-center gap-1.5 sm:gap-2 ${activeStep === 1 ? "text-[#c81e28]" : "text-gray-400"}`}>
        <ShoppingBag size={18} className={activeStep === 1 ? "fill-[#c81e28] text-[#c81e28]" : ""} />
        <span>GIỎ HÀNG</span>
      </div>

      <div className="w-8 sm:w-16 border-t border-dashed border-gray-300" />

      <div className={`flex items-center gap-1.5 sm:gap-2 ${activeStep === 2 ? "text-[#c81e28]" : "text-gray-400"}`}>
        <Package size={18} className={activeStep === 2 ? "fill-[#c81e28] text-[#c81e28]" : ""} />
        <span>ĐẶT HÀNG</span>
      </div>

      <div className="w-8 sm:w-16 border-t border-dashed border-gray-300" />

      <div className={`flex items-center gap-1.5 sm:gap-2 ${activeStep === 3 ? "text-[#c81e28]" : "text-gray-400"}`}>
        <CheckCircle2 size={18} className={activeStep === 3 ? "fill-[#c81e28] text-[#c81e28]" : ""} />
        <span className="hidden sm:inline">HOÀN THÀNH ĐƠN HÀNG</span>
        <span className="sm:hidden">HOÀN THÀNH</span>
      </div>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const shipping = items.length > 0 ? 25000 : 0;
  const total = subtotal + shipping;

  // Giao diện khi giỏ hàng trống (theo mẫu TokyoLife)
  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Thanh tiến trình: GIỎ HÀNG -> ĐẶT HÀNG -> HOÀN THÀNH */}
        <CartStepsHeader activeStep={1} />

        {/* Nội dung trung tâm */}
        <div className="flex flex-col items-center justify-center py-8 sm:py-14 text-center">
          <div className="mb-6 flex justify-center">
            <img
              src={emptyCartMascot}
              alt="Giỏ hàng trống"
              className="h-44 sm:h-52 w-auto object-contain"
            />
          </div>

          <p className="text-base sm:text-lg font-medium text-gray-800 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2.5 w-full max-w-sm sm:max-w-md rounded bg-[#c81e28] hover:bg-[#a5151e] py-3.5 px-6 text-sm sm:text-base font-bold text-white uppercase tracking-wider shadow-sm transition duration-200 active:scale-98"
          >
            <ShoppingBag size={18} />
            <span>TIẾP TỤC MUA SẮM</span>
          </Link>
        </div>
      </section>
    );
  }

  // Giao diện khi giỏ hàng có sản phẩm
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Thanh tiến trình */}
      <CartStepsHeader activeStep={1} />

      <h1 className="mt-4 text-xl sm:text-2xl font-bold text-gray-900">Giỏ hàng của bạn</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]"
            >
              <img
                src={item.image}
                alt={item.name}
                className="aspect-square w-full rounded-xl object-cover sm:w-28"
              />
              <div>
                <h2 className="font-bold text-gray-900">{item.name}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Size: <span className="font-medium text-gray-800">{item.size}</span> · Màu:{" "}
                  <span className="font-medium text-gray-800">{item.color}</span>
                </p>
                <p className="mt-3 font-bold text-[#c81e28]">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeFromCart(item.key)}
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex h-9 items-center rounded-lg border border-gray-300 bg-white">
                  <button
                    type="button"
                    className="px-2.5 text-gray-600 hover:text-[#c81e28]"
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-8 text-center text-sm font-bold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="px-2.5 text-gray-600 hover:text-[#c81e28]"
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng</span>
              <span className="font-semibold text-gray-900">{formatCurrency(shipping)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-lg font-extrabold text-[#c81e28]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <Link to="/checkout" className="block mt-6">
            <button
              type="button"
              className="w-full rounded bg-[#c81e28] hover:bg-[#a5151e] py-3.5 text-sm sm:text-base font-bold text-white uppercase tracking-wider shadow-sm transition duration-200 active:scale-98"
            >
              Tiến hành thanh toán
            </button>
          </Link>
        </aside>
      </div>
    </section>
  );
}
