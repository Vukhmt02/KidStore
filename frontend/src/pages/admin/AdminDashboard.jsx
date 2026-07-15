import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  XCircle
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";
import { formatCurrency } from "../../utils/formatCurrency";

// ── Status config (khớp với AdminOrders) ─────────────────────
const STATUS_CONFIG = {
  Pending: { label: "Chờ xác nhận", color: "text-amber-600 bg-amber-50", dot: "bg-amber-500" },
  Confirmed: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50", dot: "bg-blue-500" },
  Shipping: { label: "Đang giao", color: "text-purple-600 bg-purple-50", dot: "bg-purple-500" },
  Delivered: { label: "Hoàn thành", color: "text-emerald-600 bg-emerald-50", dot: "bg-emerald-500" },
  Cancelled: { label: "Đã hủy", color: "text-red-600 bg-red-50", dot: "bg-red-500" }
};

function getStatusConfig(status) {
  return STATUS_CONFIG[status] || { label: status, color: "text-gray-600 bg-gray-50", dot: "bg-gray-400" };
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

// ── Inline bar chart (pure CSS, no lib) ──────────────────────
function RevenueChart({ data }) {
  if (!data || data.length === 0) return null;
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="mt-4">
      <div className="flex items-end gap-2 h-36">
        {data.map((day) => {
          const heightPct = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1 group">
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className="w-full rounded-t-lg bg-berry/20 group-hover:bg-berry/40 transition-all duration-300"
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                  title={`${day.date}: ${formatCurrency(day.revenue)} (${day.orders} đơn)`}
                />
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                  <div className="rounded-xl bg-cocoa px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap">
                    <p className="font-bold">{formatCurrency(day.revenue)}</p>
                    <p className="text-white/70">{day.orders} đơn</p>
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cocoa" />
                </div>
              </div>
              <span className="text-[10px] font-semibold text-cocoa/50">{day.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu thống kê.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (isLoading) {
    return (
      <div className="grid min-h-[400px] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-berry" size={36} />
          <p className="text-sm font-semibold text-cocoa/50">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-[400px] place-items-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="text-red-400" size={40} />
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={loadStats}
            type="button"
            className="rounded-2xl bg-berry px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // ── KPI cards ─────────────────────────────────────────────
  const kpiCards = [
    {
      label: "Tổng doanh thu",
      value: formatCurrency(stats.totalRevenue),
      sub: `Tháng này: ${formatCurrency(stats.revenueThisMonth)}`,
      icon: TrendingUp,
      color: "bg-mint",
      iconColor: "text-emerald-600"
    },
    {
      label: "Đơn hàng hôm nay",
      value: stats.ordersToday,
      sub: `Tổng: ${stats.totalOrders} đơn`,
      icon: ClipboardList,
      color: "bg-peach",
      iconColor: "text-orange-500"
    },
    {
      label: "Sản phẩm đang bán",
      value: stats.activeProducts,
      sub: `Tổng: ${stats.totalProducts} sản phẩm`,
      icon: Package,
      color: "bg-skysoft",
      iconColor: "text-blue-500"
    },
    {
      label: "Khách hàng",
      value: stats.totalCustomers,
      sub: `Mới tháng này: ${stats.newCustomersThisMonth}`,
      icon: Users,
      color: "bg-lemon",
      iconColor: "text-yellow-600"
    }
  ];

  // ── Order status breakdown ─────────────────────────────────
  const orderStatusCards = [
    { label: "Chờ xác nhận", count: stats.ordersPending, icon: ClipboardList, colorClass: "text-amber-600 bg-amber-50" },
    { label: "Đang giao", count: stats.ordersShipping, icon: Truck, colorClass: "text-purple-600 bg-purple-50" },
    { label: "Hoàn thành", count: stats.ordersDelivered, icon: CheckCircle2, colorClass: "text-emerald-600 bg-emerald-50" },
    { label: "Đã hủy", count: stats.ordersCancelled, icon: XCircle, colorClass: "text-red-600 bg-red-50" }
  ];

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Tổng quan</h2>
          <p className="mt-2 text-sm text-cocoa/60">
            Theo dõi đơn hàng, doanh thu và hiệu suất kinh doanh.
          </p>
        </div>
        <button
          onClick={loadStats}
          type="button"
          className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-cocoa hover:bg-peach transition"
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[1.5rem] border border-cocoa/10 bg-white p-5 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                <Icon size={22} className={card.iconColor} />
              </div>
              <p className="mt-5 text-sm font-semibold text-cocoa/55">{card.label}</p>
              <p className="mt-1 text-2xl font-black text-cocoa">{card.value}</p>
              <p className="mt-1 text-xs text-cocoa/45">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {orderStatusCards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to="/admin/orders"
              className="flex items-center gap-3 rounded-2xl border border-cocoa/10 bg-white p-4 shadow-sm hover:shadow-md transition group"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.colorClass} group-hover:scale-110 transition-transform`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-cocoa">{item.count}</p>
                <p className="text-xs font-semibold text-cocoa/50">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main grid: chart + top products | recent orders */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

        {/* Left column */}
        <div className="grid gap-6">

          {/* Revenue 7-day chart */}
          <section className="rounded-[1.5rem] border border-cocoa/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-cocoa">Doanh thu 7 ngày qua</h3>
                <p className="text-sm text-cocoa/50">
                  Hôm nay: <span className="font-bold text-berry">{formatCurrency(stats.revenueToday)}</span>
                </p>
              </div>
              <BarChart3 size={22} className="text-berry/60" />
            </div>
            <RevenueChart data={stats.revenueChart} />
          </section>

          {/* Top products */}
          <section className="rounded-[1.5rem] border border-cocoa/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-cocoa">Sản phẩm bán chạy</h3>
              <ShoppingCart size={20} className="text-berry/60" />
            </div>
            {stats.topProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-cocoa/40">Chưa có dữ liệu bán hàng.</p>
            ) : (
              <div className="grid gap-2">
                {stats.topProducts.map((product, index) => {
                  const maxSold = stats.topProducts[0]?.totalSold || 1;
                  const barWidth = (product.totalSold / maxSold) * 100;
                  return (
                    <div key={product.productId} className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-black text-cocoa/40">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-bold text-cocoa">
                            {product.productName}
                          </p>
                          <span className="whitespace-nowrap text-xs font-bold text-berry">
                            {product.totalSold} sản phẩm
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-cream">
                          <div
                            className="h-full rounded-full bg-berry/70 transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Recent orders */}
        <section className="rounded-[1.5rem] border border-cocoa/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-black text-cocoa">Đơn hàng gần đây</h3>
            <Link
              to="/admin/orders"
              className="text-sm font-bold text-berry hover:text-cocoa transition"
            >
              Xem tất cả
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-cocoa/40">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="grid gap-3">
              {stats.recentOrders.map((order) => {
                const cfg = getStatusConfig(order.status);
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 rounded-2xl bg-cream/50 p-3 hover:bg-cream transition"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white font-black text-cocoa/60 text-xs shadow-sm">
                      #{order.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-cocoa">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-cocoa/50">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${cfg.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      <p className="mt-1 text-xs font-bold text-berry">
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
