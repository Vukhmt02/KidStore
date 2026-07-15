import { CheckCircle2, Copy, Download, Home, Package } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const BANK = {
  id: "vcb",
  name: "Vietcombank",
  accountNo: "1036167027",
  accountName: "DUONG KIM VU"
};

function buildVietQRUrl(amount, orderId) {
  const addInfo = encodeURIComponent(`KIDSTORE DH${orderId}`);
  const accountName = encodeURIComponent(BANK.accountName);
  return (
    `https://img.vietqr.io/image/${BANK.id}-${BANK.accountNo}-compact2.png` +
    `?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`
  );
}

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const isBankTransfer = order?.paymentMethod === "BankTransfer";
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  // Redirect nếu truy cập thẳng không qua đặt hàng
  useEffect(() => {
    if (!order) navigate("/", { replace: true });
  }, [order, navigate]);

  // Preload QR ngay khi có thông tin đơn hàng
  useEffect(() => {
    if (!order || !isBankTransfer) return;
    const img = new Image();
    const url = buildVietQRUrl(order.totalPrice, order.id);
    img.onload = () => setQrLoaded(true);
    img.src = url;
    // Nếu đã cache sẵn (từ trang checkout)
    if (img.complete && img.naturalWidth > 0) setQrLoaded(true);
  }, [order, isBankTransfer]);

  if (!order) {
    return null;
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-2xl">

        {/* Success header */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-cocoa">Đặt hàng thành công!</h1>
          <p className="mt-3 text-cocoa/60">
            Mã đơn hàng của bạn là{" "}
            <span className="font-black text-berry">#{order.id}</span>
          </p>
        </div>

        {/* Order summary */}
        <div className="mt-8 rounded-[2rem] border border-cocoa/10 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-black text-cocoa">
            <Package size={20} />
            Thông tin đơn hàng
          </h2>
          <div className="mt-4 grid gap-2 text-sm">
            {[
              { label: "Người nhận", value: order.customerName },
              { label: "Số điện thoại", value: order.phoneNumber },
              { label: "Địa chỉ", value: order.shippingAddress },
              { label: "Thanh toán", value: isBankTransfer ? "Chuyển khoản ngân hàng" : "Thanh toán khi nhận hàng (COD)" },
              { label: "Tổng tiền", value: formatCurrency(order.totalPrice), highlight: true }
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex justify-between gap-3 rounded-xl bg-cream/60 px-4 py-2.5">
                <span className="text-cocoa/60">{label}</span>
                <span className={`text-right font-bold ${highlight ? "text-berry" : "text-cocoa"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* VietQR Payment section */}
        {isBankTransfer && (
          <div className="mt-6 rounded-[2rem] border-2 border-berry/20 bg-white p-6 shadow-sm">
            <div className="text-center">
              <h2 className="text-xl font-black text-cocoa">Quét QR để thanh toán</h2>
              <p className="mt-2 text-sm text-cocoa/60">
                Sử dụng app ngân hàng bất kỳ để quét mã QR bên dưới
              </p>
            </div>

            {/* QR Code */}
            <div className="mt-5 flex justify-center">
              <div className="relative rounded-2xl border border-cocoa/10 bg-cream p-3 shadow-inner">
                {!qrLoaded && (
                  <div className="absolute inset-3 flex items-center justify-center rounded-xl bg-cream">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-berry/20 border-t-berry" />
                  </div>
                )}
                <img
                  src={buildVietQRUrl(order.totalPrice, order.id)}
                  alt="QR thanh toán VietQR"
                  className={`h-56 w-56 rounded-xl object-contain transition-opacity duration-300 ${qrLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setQrLoaded(true)}
                />
              </div>
            </div>

            {/* Bank info */}
            <div className="mt-5 grid gap-2 rounded-2xl bg-cream/70 p-4 text-sm">
              {[
                { label: "Ngân hàng", value: BANK.name },
                { label: "Số tài khoản", value: BANK.accountNo, canCopy: true },
                { label: "Chủ tài khoản", value: "Dương Kim Vũ" },
                { label: "Số tiền", value: formatCurrency(order.totalPrice), canCopy: true, rawValue: String(order.totalPrice) },
                { label: "Nội dung CK", value: `KIDSTORE DH${order.id}`, canCopy: true }
              ].map(({ label, value, canCopy, rawValue }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="text-cocoa/60 shrink-0">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cocoa text-right">{value}</span>
                    {canCopy && (
                      <button
                        type="button"
                        onClick={() => handleCopy(rawValue || value)}
                        className="shrink-0 rounded-lg bg-white p-1.5 text-cocoa/50 hover:text-berry transition"
                        title="Sao chép"
                      >
                        <Copy size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {copied && (
              <p className="mt-2 text-center text-xs font-semibold text-emerald-600">
                ✓ Đã sao chép!
              </p>
            )}

            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center text-xs font-semibold text-amber-700">
              ⚠️ Vui lòng chuyển khoản đúng nội dung để đơn hàng được xác nhận nhanh nhất.
            </p>
          </div>
        )}

        {/* COD notice */}
        {!isBankTransfer && (
          <div className="mt-6 rounded-2xl bg-cream px-5 py-4 text-sm text-cocoa/70 text-center">
            💵 Bạn sẽ thanh toán khi nhận hàng. Chúng tôi sẽ liên hệ xác nhận đơn sớm nhất.
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-2xl bg-cream px-6 py-3.5 text-sm font-bold text-cocoa hover:bg-peach transition"
          >
            <Home size={17} />
            Về trang chủ
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 rounded-2xl bg-berry px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>

      </div>
    </section>
  );
}
