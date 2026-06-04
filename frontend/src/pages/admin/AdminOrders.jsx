import { Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { orders } from "../../data/admin";
import { formatCurrency } from "../../utils/formatCurrency";

const statuses = ["Tất cả", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];

export default function AdminOrders() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Tất cả");

  const filteredOrders = useMemo(
    () =>
      orders
        .filter((order) => status === "Tất cả" || order.status === status)
        .filter((order) => `${order.id} ${order.customer} ${order.phone}`.toLowerCase().includes(query.toLowerCase().trim())),
    [query, status]
  );

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Quản lý đơn hàng</h2>
        <p className="mt-2 text-sm text-cocoa/60">Kiểm tra, cập nhật trạng thái và theo dõi đơn hàng.</p>
      </div>

      <div className="rounded-[1.5rem] border border-cocoa/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/45" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm mã đơn, khách hàng, số điện thoại..."
              className="w-full rounded-2xl border border-cocoa/10 bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-berry focus:bg-white"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                  status === item ? "bg-berry text-white" : "bg-cream text-cocoa hover:bg-peach"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-cocoa/45">
              <tr>
                <th className="py-3">Mã đơn</th>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th className="text-right">Tong</th>
                <th className="text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/10">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-4 font-black text-cocoa">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.phone}</td>
                  <td>{order.date}</td>
                  <td>
                    <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-cocoa">{order.status}</span>
                  </td>
                  <td className="text-right font-bold text-berry">{formatCurrency(order.total)}</td>
                  <td className="text-right">
                    <button className="rounded-full bg-cream p-2 text-cocoa hover:text-berry" type="button" aria-label="Xem đơn hàng">
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
