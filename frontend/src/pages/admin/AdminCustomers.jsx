import { Search, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../components/Button";
import { customers } from "../../data/admin";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminCustomers() {
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(
    () => customers.filter((customer) => `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase().trim())),
    [query]
  );

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Quản lý khách hàng</h2>
          <p className="mt-2 text-sm text-cocoa/60">Theo dõi thông tin khách hàng và lịch sử mua hàng.</p>
        </div>
        <Button>
          <UserPlus size={18} />
          Thêm khách
        </Button>
      </div>

      <div className="rounded-[1.5rem] border border-cocoa/10 bg-white p-4 shadow-sm">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/45" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm khách hàng..."
            className="w-full rounded-2xl border border-cocoa/10 bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-berry focus:bg-white"
          />
        </label>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <article key={customer.id} className="rounded-[1.5rem] border border-cocoa/10 bg-cream p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-berry text-lg font-black text-white">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-cocoa">{customer.name}</h3>
                  <p className="text-sm text-cocoa/60">{customer.email}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-cocoa/50">Đơn hàng</p>
                  <p className="mt-1 font-black text-cocoa">{customer.orders}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-cocoa/50">Đã chi</p>
                  <p className="mt-1 font-black text-berry">{formatCurrency(customer.spent)}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-cocoa/65">{customer.phone}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
