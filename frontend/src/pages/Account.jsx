import { Clock, KeyRound, MapPin, PackageCheck, Phone, UserRound } from "lucide-react";
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
  const [profileErrors, setProfileErrors] = useState({});
  const [profileMessage, setProfileMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // State cho Đổi mật khẩu
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/account",
          message: "Vui lòng đăng nhập để xem tài khoản"
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
          setProfileErrors({ form: error.message || "Không thể tải thông tin tài khoản." });
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

  // Cập nhật thông tin cá nhân (Họ tên, SĐT, Địa chỉ)
  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = form.get("fullName")?.toString().trim();

    if (!fullName) {
      setProfileErrors({ form: "Họ và tên không được để trống." });
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileMessage("");
      setProfileErrors({});

      const updatedUser = await authService.updateProfile({
        fullName,
        phoneNumber: form.get("phoneNumber"),
        address: form.get("address")
      });

      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("authChanged"));
      setProfileMessage("Cập nhật thông tin thành công!");
    } catch (error) {
      setProfileErrors({ form: error.message || "Không thể cập nhật thông tin." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const currentPassword = form.get("currentPassword")?.toString().trim();
    const newPassword = form.get("newPassword")?.toString().trim();
    const confirmNewPassword = form.get("confirmNewPassword")?.toString().trim();

    const formErrors = {};
    if (!currentPassword) formErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    if (!newPassword || newPassword.length < 6) {
      formErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }
    if (newPassword !== confirmNewPassword) {
      formErrors.confirmNewPassword = "Mật khẩu xác nhận không trùng khớp.";
    }

    if (Object.keys(formErrors).length > 0) {
      setPasswordErrors(formErrors);
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordMessage("");
      setPasswordErrors({});

      const response = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword
      });

      setPasswordMessage(response?.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      event.target.reset();

      // Sau 2.5 giây tự động điều hướng sang trang Login vì token cũ đã bị thu hồi
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        window.dispatchEvent(new Event("authChanged"));
        navigate("/login", {
          state: { message: "Đổi mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới." }
        });
      }, 2500);
    } catch (error) {
      setPasswordErrors({ form: error.message || "Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <section className="container-page py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-berry">Tài khoản của tôi</p>
        <h1 className="section-title">Thông tin & Cài đặt</h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[440px_1fr]">
        <div className="flex flex-col gap-6">
          {/* Form Cập nhật thông tin cá nhân */}
          <form
            className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-soft"
            onSubmit={handleUpdateProfile}
          >
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
              <Input
                label="Họ và tên"
                name="fullName"
                defaultValue={user?.fullName || ""}
                placeholder="Nguyễn Văn A"
                required
              />
              <Input
                label="Số điện thoại"
                name="phoneNumber"
                defaultValue={user?.phoneNumber || ""}
                placeholder="0909 123 456"
              />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-cocoa">Địa chỉ</span>
                <textarea
                  name="address"
                  rows="3"
                  defaultValue={user?.address || ""}
                  placeholder="Số nhà, phường, quận, tỉnh/thành phố"
                  className="w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-berry focus:ring-4 focus:ring-berry/10"
                />
              </label>
            </div>

            {profileMessage && (
              <p className="mt-5 rounded-2xl bg-mint/70 px-4 py-3 text-sm font-semibold text-cocoa">
                {profileMessage}
              </p>
            )}
            {profileErrors.form && (
              <p className="mt-5 rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">
                {profileErrors.form}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSavingProfile}>
              {isSavingProfile ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </form>

          {/* Form Đổi mật khẩu */}
          <form
            className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-soft"
            onSubmit={handleChangePassword}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lemon text-cocoa">
                <KeyRound size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-cocoa">Đổi mật khẩu</h2>
                <p className="text-xs text-cocoa/60">Bảo mật tài khoản của bạn</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  required
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-xs font-semibold text-berry">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <Input
                  label="Mật khẩu mới (tối thiểu 6 ký tự)"
                  type="password"
                  name="newPassword"
                  placeholder="••••••••"
                  required
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-xs font-semibold text-berry">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <Input
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  name="confirmNewPassword"
                  placeholder="••••••••"
                  required
                />
                {passwordErrors.confirmNewPassword && (
                  <p className="mt-1 text-xs font-semibold text-berry">{passwordErrors.confirmNewPassword}</p>
                )}
              </div>
            </div>

            {passwordMessage && (
              <p className="mt-5 rounded-2xl bg-mint/70 px-4 py-3 text-sm font-semibold text-cocoa">
                {passwordMessage}
              </p>
            )}
            {passwordErrors.form && (
              <p className="mt-5 rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">
                {passwordErrors.form}
              </p>
            )}

            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="mt-6 w-full"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </Button>
          </form>
        </div>

        {/* Lịch sử đơn hàng */}
        <div className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <PackageCheck size={22} className="text-berry" />
            <h2 className="text-xl font-black text-cocoa">Lịch sử đơn hàng</h2>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="Chưa có đơn hàng"
                description="Các đơn hàng sau khi thanh toán sẽ hiển thị tại đây."
                actionLabel="Mua sắm ngay"
                onAction={() => navigate("/products")}
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-3xl border border-cocoa/10 bg-cream p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-cocoa/60">Đơn hàng #{order.id}</p>
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
