import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Loader2,
  Lock,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  Unlock,
  User
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { customerService } from "../../services/customerService";
import { formatCurrency } from "../../utils/formatCurrency";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-berry",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-pink-500"
];

function getAvatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "active" | "locked"
  const [togglingId, setTogglingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { customer }

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await customerService.adminGetAll();
      setCustomers(data);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách khách hàng.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleToggleActive = async (customer) => {
    setConfirmModal(null);
    try {
      setTogglingId(customer.id);
      const result = await customerService.adminToggleActive(customer.id);
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, isActive: result.isActive } : c))
      );
    } catch (err) {
      alert(err.message || "Thao tác thất bại.");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (filter === "active") result = result.filter((c) => c.isActive);
    if (filter === "locked") result = result.filter((c) => !c.isActive);

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.fullName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phoneNumber?.includes(q)
      );
    }

    return result;
  }, [customers, query, filter]);

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter((c) => c.isActive).length,
    locked: customers.filter((c) => !c.isActive).length,
    totalRevenue: customers.reduce((s, c) => s + (c.totalSpent || 0), 0)
  }), [customers]);

  if (isLoading) {
    return (
      <div className="grid min-h-[400px] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-berry" size={36} />
          <p className="text-sm font-semibold text-cocoa/50">Đang tải danh sách khách hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Quản lý khách hàng</h2>
          <p className="mt-2 text-sm text-cocoa/60">
            Theo dõi thông tin và quản lý tài khoản khách hàng.
          </p>
        </div>
        <button
          onClick={loadCustomers}
          type="button"
          className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-cocoa hover:bg-peach transition"
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Tổng khách hàng", value: stats.total, icon: User, color: "text-blue-500 bg-blue-50" },
          { label: "Đang hoạt động", value: stats.active, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "Đã khóa", value: stats.locked, icon: Lock, color: "text-red-600 bg-red-50" },
          { label: "Tổng chi tiêu", value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "text-berry bg-pink-50" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-cocoa/10 bg-white p-4 shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                <Icon size={18} />
              </div>
              <p className="mt-3 text-xs font-semibold text-cocoa/50">{item.label}</p>
              <p className="mt-0.5 text-xl font-black text-cocoa">{item.value}</p>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Filters + Search */}
      <div className="rounded-[1.5rem] border border-cocoa/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/45" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tên, email, số điện thoại..."
              className="w-full rounded-2xl border border-cocoa/10 bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-berry focus:bg-white"
            />
          </label>
          <div className="flex gap-2">
            {[
              { key: "all", label: "Tất cả" },
              { key: "active", label: "Hoạt động" },
              { key: "locked", label: "Đã khóa" }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  filter === tab.key ? "bg-berry text-white" : "bg-cream text-cocoa hover:bg-peach"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="mt-5">
          {filteredCustomers.length === 0 ? (
            <div className="py-16 text-center">
              <User className="mx-auto mb-3 text-cocoa/25" size={40} />
              <p className="text-sm text-cocoa/50">Không tìm thấy khách hàng nào.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  isToggling={togglingId === customer.id}
                  onToggle={() => setConfirmModal(customer)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmModal && (
        <ConfirmModal
          customer={confirmModal}
          onConfirm={() => handleToggleActive(confirmModal)}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}

// ── Customer Card ─────────────────────────────────────────────
function CustomerCard({ customer, isToggling, onToggle }) {
  const isActive = customer.isActive;
  const avatarColor = getAvatarColor(customer.id);

  return (
    <article
      className={`relative rounded-[1.5rem] border p-5 transition ${
        isActive
          ? "border-cocoa/10 bg-white"
          : "border-red-200 bg-red-50/50"
      }`}
    >
      {/* Status badge */}
      {!isActive && (
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
          <Lock size={11} /> Đã khóa
        </span>
      )}

      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${avatarColor} ${
            !isActive ? "opacity-50" : ""
          }`}
        >
          {getInitials(customer.fullName)}
        </div>
        <div className="min-w-0">
          <h3 className={`truncate font-black ${isActive ? "text-cocoa" : "text-cocoa/50"}`}>
            {customer.fullName}
          </h3>
          <p className="truncate text-sm text-cocoa/55">{customer.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 rounded-2xl bg-cream/80 p-3">
          <ShoppingBag size={15} className="text-cocoa/50 shrink-0" />
          <div>
            <p className="text-xs text-cocoa/50">Đơn hàng</p>
            <p className="font-black text-cocoa">{customer.totalOrders}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-cream/80 p-3">
          <TrendingUp size={15} className="text-berry/70 shrink-0" />
          <div>
            <p className="text-xs text-cocoa/50">Đã chi</p>
            <p className="font-black text-berry truncate">{formatCurrency(customer.totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Info row */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-cocoa/50">
        {customer.phoneNumber && (
          <span className="font-semibold">{customer.phoneNumber}</span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {formatDate(customer.createdAt)}
        </span>
        {customer.lastLoginAt && (
          <span className="flex items-center gap-1">
            <Package size={11} />
            Đăng nhập: {formatDate(customer.lastLoginAt)}
          </span>
        )}
      </div>

      {/* Action */}
      <div className="mt-4 border-t border-cocoa/10 pt-4">
        <button
          type="button"
          disabled={isToggling}
          onClick={onToggle}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-bold transition disabled:opacity-50 ${
            isActive
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          {isToggling ? (
            <Loader2 className="animate-spin" size={15} />
          ) : isActive ? (
            <Lock size={15} />
          ) : (
            <Unlock size={15} />
          )}
          {isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        </button>
      </div>
    </article>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────
function ConfirmModal({ customer, onConfirm, onCancel }) {
  const isLocking = customer.isActive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-xl">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            isLocking ? "bg-red-100" : "bg-emerald-100"
          }`}
        >
          {isLocking ? (
            <Lock size={24} className="text-red-600" />
          ) : (
            <Unlock size={24} className="text-emerald-600" />
          )}
        </div>

        <h3 className="text-center text-lg font-black text-cocoa">
          {isLocking ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
        </h3>
        <p className="mt-2 text-center text-sm text-cocoa/60">
          <strong>{customer.fullName}</strong>
          {isLocking
            ? " sẽ không thể đăng nhập và tất cả phiên đang hoạt động sẽ bị thu hồi."
            : " sẽ có thể đăng nhập trở lại vào hệ thống."}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-cream py-3 text-sm font-bold text-cocoa hover:bg-peach transition"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-2xl py-3 text-sm font-bold text-white transition ${
              isLocking
                ? "bg-red-500 hover:bg-red-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {isLocking ? "Khóa" : "Mở khóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
