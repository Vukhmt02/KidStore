import { Copy, CreditCard, MapPin, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";
import { useCart } from "../hooks/useCart";
import { orderService } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";

const BANK = {
  id: "vcb",
  name: "Vietcombank",
  accountNo: "1036167027",
  accountName: "DUONG KIM VU"
};

function buildVietQRUrl(amount) {
  const addInfo = encodeURIComponent("KIDSTORE THANH TOAN");
  const accountName = encodeURIComponent(BANK.accountName);
  return (
    `https://img.vietqr.io/image/${BANK.id}-${BANK.accountNo}-compact2.png` +
    `?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [qrLoaded, setQrLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const shipping = items.length > 0 ? 25000 : 0;
  const total = subtotal + shipping;

  // Preload QR ngay khi biết tổng tiền — đưa vào cache trình duyệt
  useEffect(() => {
    if (total <= 0) return;
    const img = new Image();
    img.src = buildVietQRUrl(total);
  }, [total]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login", {
        replace: true,
        state: { from: "/checkout", message: "Vui lòng đăng nhập để thanh toán." }
      });
    }
  }, [navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const nextErrors = {};

    if (!form.get("name")) nextErrors.name = "Không được để trống";
    if (!form.get("phone")) nextErrors.phone = "Không được để trống";
    if (!form.get("address")) nextErrors.address = "Không được để trống";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const order = await orderService.create({
        customerName: form.get("name"),
        phoneNumber: form.get("phone"),
        shippingAddress: form.get("address"),
        note: form.get("note"),
        paymentMethod
      });

      await clearCart({ syncServer: false });
      navigate("/order-success", { state: { order } });
    } catch (error) {
      setErrors({ form: error.message || "Không thể đặt hàng lúc này." });
    } finally {
      setIsSubmitting(false);
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
        <form
          className="rounded-[2rem] border border-cocoa/10 bg-white p-6 shadow-sm sm:p-8"
          onSubmit={handleSubmit}
        >
          {/* Shipping info */}
          <div className="flex items-center gap-2 text-cocoa">
            <MapPin size={20} />
            <h2 className="text-xl font-black">Thông tin giao hàng</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="Họ tên" name="name" placeholder="Nguyễn Minh An" error={errors.name} />
            <Input label="Số điện thoại" name="phone" placeholder="0909 123 456" error={errors.phone} />
            <Input
              label="Địa chỉ"
              name="address"
              placeholder="Số nhà, phường, quận"
              error={errors.address}
              className="sm:col-span-2"
            />
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-cocoa">Ghi chú</span>
              <textarea
                name="note"
                rows="3"
                placeholder="Thời gian giao hàng mong muốn..."
                className="w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-berry focus:ring-4 focus:ring-berry/10"
              />
            </label>
          </div>

          {/* Payment method */}
          <div className="mt-8 flex items-center gap-2 text-cocoa">
            <CreditCard size={20} />
            <h2 className="text-xl font-black">Phương thức thanh toán</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {/* COD */}
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-semibold transition ${
                paymentMethod === "COD"
                  ? "border-berry bg-berry/5"
                  : "border-cocoa/10 bg-cream"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="accent-berry"
              />
              <span>💵 Thanh toán khi nhận hàng (COD)</span>
            </label>

            {/* Bank Transfer */}
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-semibold transition ${
                paymentMethod === "BankTransfer"
                  ? "border-berry bg-berry/5"
                  : "border-cocoa/10 bg-white"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="BankTransfer"
                checked={paymentMethod === "BankTransfer"}
                onChange={() => {
                // Kiểm tra QR đã có trong cache chưa
                const testImg = new Image();
                testImg.src = buildVietQRUrl(total);
                // Nếu đã cache, naturalWidth > 0 ngay lập tức
                setQrLoaded(testImg.complete && testImg.naturalWidth > 0);
                setPaymentMethod("BankTransfer");
              }}
                className="accent-berry"
              />
              <span className="flex items-center gap-2">
                <QrCode size={16} />
                Chuyển khoản ngân hàng (VietQR)
              </span>
            </label>
          </div>

          {/* QR Preview khi chọn BankTransfer */}
          {paymentMethod === "BankTransfer" && (
            <div className="mt-4 rounded-2xl border border-berry/20 bg-cream/50 p-5">
              <p className="mb-3 text-center text-sm font-bold text-cocoa">
                Xem trước QR — quét để thanh toán ngay
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                {/* QR */}
                <div className="relative flex-shrink-0 rounded-2xl border border-cocoa/10 bg-white p-2.5 shadow-sm">
                  {!qrLoaded && (
                    <div className="absolute inset-2.5 flex items-center justify-center rounded-xl bg-white">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-berry/20 border-t-berry" />
                    </div>
                  )}
                  <img
                    src={buildVietQRUrl(total)}
                    alt="VietQR"
                    className={`h-44 w-44 rounded-xl object-contain transition-opacity duration-300 ${qrLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setQrLoaded(true)}
                  />
                </div>

                {/* Bank info */}
                <div className="flex-1 w-full grid gap-1.5 text-xs">
                  {[
                    { label: "Ngân hàng", value: BANK.name },
                    { label: "Số TK", value: BANK.accountNo, canCopy: true },
                    { label: "Chủ TK", value: "Dương Kim Vũ" },
                    { label: "Số tiền", value: formatCurrency(total), canCopy: true, rawValue: String(total) },
                    { label: "Nội dung", value: "KIDSTORE THANH TOAN", canCopy: true }
                  ].map(({ label, value, canCopy, rawValue }) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                      <span className="text-cocoa/55">{label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-cocoa">{value}</span>
                        {canCopy && (
                          <button
                            type="button"
                            onClick={() => handleCopy(rawValue || value)}
                            className="rounded-lg p-1 text-cocoa/40 hover:text-berry transition"
                          >
                            <Copy size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {copied && (
                    <p className="text-center text-xs font-semibold text-emerald-600">✓ Đã sao chép!</p>
                  )}
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-semibold text-amber-700">
                ⚠️ Mã đơn hàng chi tiết sẽ hiện sau khi bạn bấm "Đặt hàng"
              </p>
            </div>
          )}

          {errors.form && (
            <p className="mt-5 rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">
              {errors.form}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Đang đặt hàng..." : "Đặt hàng"}
          </Button>
        </form>

        {/* Order summary sidebar */}
        <aside className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-cocoa">Đơn hàng</h2>
          <div className="mt-5 grid gap-4">
            {items.map((item) => (
              <div key={item.key} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-bold text-cocoa">{item.name}</p>
                  <p className="text-xs text-cocoa/60">
                    {[item.sizeName, item.colorName].filter(Boolean).join(" / ")} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-berry whitespace-nowrap">
                  {formatCurrency(item.price * item.quantity)}
                </p>
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
