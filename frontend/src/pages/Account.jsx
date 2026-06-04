import { Clock, MapPin, PackageCheck, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";
import Loading from "../components/Loading";
import { authService } from "../services/authService";
import { orderService } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/account",
          message: "Vui long dang nhap de xem tai khoan."
        }
      });
      return;
    }

    let ignore = false;

    async function loadAccount() {
      try {
        const [profile, orderData] = await Promise.all([
          authService.getCurrentUser(),
          orderService.getMine()
        ]);

        if (ignore) return;

        setUser(profile);
        setOrders(Array.isArray(orderData) ? orderData : []);
        localStorage.setItem("currentUser", JSON.stringify(profile));
      } catch (error) {
        if (!ignore) {
          setErrors({ form: error.message || "Khong the tai thong tin tai khoan." });
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadAccount();

    return () => {
      ignore = true;
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      setIsSaving(true);
      setMessage("");
      setErrors({});

      const updatedUser = await authService.updateProfile({
        phoneNumber: form.get("phoneNumber"),
        address: form.get("address")
      });

      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("authChanged"));
      setMessage("Cap nhat thong tin thanh cong.");
    } catch (error) {
      setErrors({ form: error.message || "Khong the cap nhat thong tin." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <section className="container-page py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-berry">Tai khoan cua toi</p>
        <h1 className="section-title">Thong tin ca nhan</h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <form className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-peach text-cocoa">
              <UserRound size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-cocoa">{user?.fullName}</h2>
              <p className="text-sm text-cocoa/60">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <Input label="So dien thoai" name="phoneNumber" defaultValue={user?.phoneNumber || ""} placeholder="0909 123 456" />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cocoa">Dia chi</span>
              <textarea
                name="address"
                rows="4"
                defaultValue={user?.address || ""}
                placeholder="So nha, phuong, quan"
                className="w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-berry focus:ring-4 focus:ring-berry/10"
              />
            </label>
          </div>

          {message && <p className="mt-5 rounded-2xl bg-mint/70 px-4 py-3 text-sm font-semibold text-cocoa">{message}</p>}
          {errors.form && <p className="mt-5 rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{errors.form}</p>}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSaving}>
            {isSaving ? "Dang luu..." : "Luu thong tin"}
          </Button>
        </form>

        <div className="rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <PackageCheck size={22} className="text-berry" />
            <h2 className="text-xl font-black text-cocoa">Lich su don hang</h2>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="Chua co don hang"
                description="Cac don hang sau khi thanh toan se hien tai day."
                actionLabel="Mua sam ngay"
                onAction={() => navigate("/products")}
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-3xl border border-cocoa/10 bg-cream p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-cocoa/60">Don hang #{order.id}</p>
                      <h3 className="mt-1 text-lg font-black text-cocoa">{formatCurrency(order.totalPrice)}</h3>
                    </div>
                    <span className="w-fit rounded-full bg-white px-4 py-2 text-xs font-black text-berry">
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-cocoa/70">
                    <p className="flex items-center gap-2">
                      <Clock size={15} />
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={15} />
                      {order.phoneNumber}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={15} />
                      {order.shippingAddress}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 border-t border-cocoa/10 pt-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-semibold text-cocoa">
                          {item.productName} x{item.quantity}
                        </span>
                        <span className="font-bold text-berry">{formatCurrency(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
