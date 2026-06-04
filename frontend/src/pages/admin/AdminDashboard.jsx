import { ClipboardList, Package, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { orders, staffTasks } from "../../data/admin";
import { products } from "../../data/products";
import { formatCurrency } from "../../utils/formatCurrency";

const stats = [
  { label: "Doanh thu hôm nay", value: formatCurrency(2849000), icon: TrendingUp, color: "bg-mint" },
  { label: "Đơn mới", value: "12", icon: ClipboardList, color: "bg-peach" },
  { label: "Sản phẩm", value: products.length, icon: Package, color: "bg-skysoft" },
  { label: "Khách hàng", value: "128", icon: Users, color: "bg-lemon" }
];

export default function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Tổng quan</h2>
        <p className="mt-2 text-sm text-cocoa/60">Theo dõi đơn hàng, doanh thu và việc cần làm trong ngày.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-[1.5rem] border border-cocoa/10 bg-white p-5 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color} text-cocoa`}>
                <Icon size={22} />
              </div>
              <p className="mt-5 text-sm font-semibold text-cocoa/55">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-cocoa">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-[1.5rem] border border-cocoa/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-black text-cocoa">Đơn hàng gần đây</h3>
            <Link to="/admin/orders" className="text-sm font-bold text-berry hover:text-cocoa">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase text-cocoa/45">
                <tr>
                  <th className="py-3">Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Tong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa/10">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 font-bold text-cocoa">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>
                      <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-cocoa">{order.status}</span>
                    </td>
                    <td className="text-right font-bold text-berry">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-cocoa/10 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-cocoa">Việc cần làm</h3>
          <div className="mt-5 grid gap-3">
            {staffTasks.map((task) => (
              <label key={task} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-cream p-4 text-sm font-bold text-cocoa">
                <input type="checkbox" className="accent-berry" />
                {task}
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
