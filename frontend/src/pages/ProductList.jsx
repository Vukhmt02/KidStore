import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../hooks/useCatalog";

export default function ProductList() {
  const { categories, products, isLoading, error } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const activeCategory = params.get("category") || "all";

  const filteredProducts = useMemo(() => {
    const result = products
      .filter((product) => activeCategory === "all" || product.category === activeCategory)
      .filter((product) => product.name.toLowerCase().includes(query.toLowerCase().trim()));

    if (sort === "price-asc") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [activeCategory, query, sort]);

  const setCategory = (category) => {
    if (category === "all") {
      setParams({});
    } else {
      setParams({ category });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <section className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">Tất cả sản phẩm</h1>
        <p className="section-subtitle">Tìm đồ mặc hằng ngày, đồ đi chơi và phụ kiện mềm mại cho bé.</p>
      </div>

      {error && <p className="mb-6 text-sm font-semibold text-berry">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[1.75rem] border border-cocoa/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-cocoa">
            <SlidersHorizontal size={18} />
            <h2 className="font-bold">Bộ lọc</h2>
          </div>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeCategory === "all" ? "bg-peach text-cocoa" : "hover:bg-cream"
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setCategory(category.id)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeCategory === category.id ? "bg-peach text-cocoa" : "hover:bg-cream"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-3 rounded-[1.75rem] border border-cocoa/10 bg-white p-4 shadow-sm sm:flex-row">
            <label className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/45" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full rounded-2xl border border-cocoa/10 bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-berry focus:bg-white"
              />
            </label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm font-semibold text-cocoa outline-none focus:border-berry focus:bg-white"
            >
              <option value="featured">Sắp xếp nổi bật</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState title="Không tìm thấy sản phẩm" description="Thử đổi từ khóa hoặc chọn danh mục khác." />
          )}
        </div>
      </div>
    </section>
  );
}
