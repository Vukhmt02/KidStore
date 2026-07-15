import { ChevronDown, ChevronUp, Eye, Loader2, Package, RefreshCw, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

const STATUS_CONFIG = {
  Pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  Confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  Shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  Delivered: { label: "Hoàn thành", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", dot: "bg-red-500" }
};

const STATUS_KEYS = Object.keys(STATUS_CONFIG);
const FILTER_TABS = ["Tất cả", ...STATUS_KEYS.map((key) => STATUS_CONFIG[key].label)];
const LABEL_TO_KEY = Object.fromEntries(STATUS_KEYS.map((key) => [STATUS_CONFIG[key].label, key]));

function getStatusConfig(status) {
  return STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-700", dot: "bg-gray-400" };
}

function getNextStatuses(currentStatus) {
  const transitions = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Shipping", "Cancelled"],
    Shipping: ["Delivered"]
  };
  return transitions[currentStatus] || [];
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await orderService.adminGetAll();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const updatedOrder = await orderService.adminUpdateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      alert(err.message || "Cập nhật trạng thái thất bại.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by tab
    if (activeTab !== "Tất cả") {
      const statusKey = LABEL_TO_KEY[activeTab];
      if (statusKey) result = result.filter((o) => o.status === statusKey);
    }

    // Filter by search
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (o) =>
          String(o.id).includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.phoneNumber?.toLowerCase().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortField === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (sortField === "totalPrice") {
        valA = a.totalPrice;
        valB = b.totalPrice;
      } else if (sortField === "id") {
        valA = a.id;
        valB = b.id;
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [orders, activeTab, query, sortField, sortDir]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const shipping = orders.filter((o) => o.status === "Shipping").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const revenue = orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + o.totalPrice, 0);
    return { total, pending, shipping, delivered, revenue };
  }, [orders]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (isLoading) {
    return (
      <div className="grid min-h-[400px] place-items-center">
        <Loader2 className="animate-spin text-berry" size={32} />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Quản lý đơn hàng</h2>
          <p className="mt-2 text-sm text-cocoa/60">
            Kiểm tra, cập nhật trạng thái và theo dõi đơn hàng.
          </p>
        </div>
        <button
          onClick={loadOrders}
          type="button"
          className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-cocoa hover:bg-peach transition"
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: "Tổng đơn", value: stats.total, color: "text-cocoa" },
          { label: "Chờ xác nhận", value: stats.pending, color: "text-amber-600" },
          { label: "Đang giao", value: stats.shipping, color: "text-purple-600" },
          { label: "Hoàn thành", value: stats.delivered, color: "text-emerald-600" },
          { label: "Doanh thu", value: formatCurrency(stats.revenue), color: "text-berry" }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-cocoa/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-cocoa/50">{item.label}</p>
            <p className={`mt-1 text-xl font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-[1.5rem] border border-cocoa/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/45" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm mã đơn, khách hàng, SĐT, email..."
              className="w-full rounded-2xl border border-cocoa/10 bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-berry focus:bg-white"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                  activeTab === tab ? "bg-berry text-white" : "bg-cream text-cocoa hover:bg-peach"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders table */}
        <div className="mt-5 overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-sm text-cocoa/50">
              <Package className="mx-auto mb-3 text-cocoa/30" size={40} />
              Không tìm thấy đơn hàng nào.
            </div>
          ) : (
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-xs uppercase text-cocoa/45">
                <tr>
                  <th className="cursor-pointer py-3" onClick={() => toggleSort("id")}>
                    <span className="inline-flex items-center gap-1">Mã đơn <SortIcon field="id" /></span>
                  </th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th className="cursor-pointer" onClick={() => toggleSort("createdAt")}>
                    <span className="inline-flex items-center gap-1">Ngày <SortIcon field="createdAt" /></span>
                  </th>
                  <th>Trạng thái</th>
                  <th className="cursor-pointer text-right" onClick={() => toggleSort("totalPrice")}>
                    <span className="inline-flex items-center gap-1 justify-end">Tổng <SortIcon field="totalPrice" /></span>
                  </th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa/10">
                {filteredOrders.map((order) => {
                  const cfg = getStatusConfig(order.status);
                  const nextStatuses = getNextStatuses(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-cream/50 transition">
                      <td className="py-4 font-black text-cocoa">#{order.id}</td>
                      <td>
                        <p className="font-semibold">{order.customerName}</p>
                        {order.customerEmail && (
                          <p className="text-xs text-cocoa/50">{order.customerEmail}</p>
                        )}
                      </td>
                      <td>{order.phoneNumber}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cfg.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="text-right font-bold text-berry">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1">
                          {nextStatuses.map((nextStatus) => {
                            const nextCfg = getStatusConfig(nextStatus);
                            return (
                              <button
                                key={nextStatus}
                                type="button"
                                disabled={updatingId === order.id}
                                onClick={() => handleUpdateStatus(order.id, nextStatus)}
                                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${nextCfg.color} hover:opacity-80 disabled:opacity-50`}
                                title={`Chuyển sang: ${nextCfg.label}`}
                              >
                                {updatingId === order.id ? (
                                  <Loader2 className="inline animate-spin" size={12} />
                                ) : (
                                  nextCfg.label
                                )}
                              </button>
                            );
                          })}
                          <button
                            className="rounded-full bg-cream p-2 text-cocoa hover:text-berry transition"
                            type="button"
                            aria-label="Xem chi tiết"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          updatingId={updatingId}
        />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus, updatingId }) {
  const cfg = getStatusConfig(order.status);
  const nextStatuses = getNextStatuses(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-cocoa/60 hover:bg-cream hover:text-cocoa transition"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-black text-cocoa">Đơn hàng #{order.id}</h3>

        {/* Status + Date */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${cfg.color}`}>
            <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="text-sm text-cocoa/50">{formatDateTime(order.createdAt)}</span>
        </div>

        {/* Customer info */}
        <div className="mt-6 grid gap-3 rounded-2xl bg-cream/60 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-cocoa/50">Khách hàng</p>
            <p className="mt-0.5 font-bold text-cocoa">{order.customerName}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-cocoa/50">Số điện thoại</p>
            <p className="mt-0.5 font-bold text-cocoa">{order.phoneNumber}</p>
          </div>
          {order.customerEmail && (
            <div>
              <p className="text-xs font-semibold text-cocoa/50">Email</p>
              <p className="mt-0.5 font-bold text-cocoa">{order.customerEmail}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-cocoa/50">Thanh toán</p>
            <p className="mt-0.5 font-bold text-cocoa">{order.paymentMethod}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-cocoa/50">Địa chỉ giao hàng</p>
            <p className="mt-0.5 font-bold text-cocoa">{order.shippingAddress}</p>
          </div>
          {order.note && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-cocoa/50">Ghi chú</p>
              <p className="mt-0.5 text-sm text-cocoa">{order.note}</p>
            </div>
          )}
        </div>

        {/* Order items */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-bold text-cocoa/60">Sản phẩm ({order.items?.length || 0})</p>
          <div className="divide-y divide-cocoa/10 rounded-2xl border border-cocoa/10">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-cocoa truncate">{item.productName}</p>
                  <p className="text-xs text-cocoa/50">
                    {[item.sizeName, item.colorName].filter(Boolean).join(" / ")} × {item.quantity}
                  </p>
                </div>
                <p className="whitespace-nowrap text-sm font-bold text-berry">
                  {formatCurrency(item.lineTotal)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mt-4 space-y-2 rounded-2xl bg-cream/60 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-cocoa/60">Tạm tính</span>
            <span className="font-bold">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cocoa/60">Phí vận chuyển</span>
            <span className="font-bold">{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-cocoa/10 pt-2 text-base">
            <span className="font-bold text-cocoa">Tổng cộng</span>
            <span className="text-lg font-black text-berry">{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        {/* Actions */}
        {nextStatuses.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <p className="w-full text-xs font-semibold text-cocoa/50">Cập nhật trạng thái:</p>
            {nextStatuses.map((nextStatus) => {
              const nextCfg = getStatusConfig(nextStatus);
              return (
                <button
                  key={nextStatus}
                  type="button"
                  disabled={updatingId === order.id}
                  onClick={() => onUpdateStatus(order.id, nextStatus)}
                  className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition ${
                    nextStatus === "Cancelled"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-berry text-white hover:opacity-90"
                  } disabled:opacity-50`}
                >
                  {updatingId === order.id ? (
                    <Loader2 className="inline animate-spin mr-1" size={14} />
                  ) : null}
                  {nextCfg.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
