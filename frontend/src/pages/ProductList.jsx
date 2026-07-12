import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { normalizeProducts, useCatalog } from "../hooks/useCatalog";
import { catalogService } from "../services/catalogService";

const pageSize = 6;

export default function ProductList() {
  const { categories, isLoading: isCatalogLoading, error: catalogError } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const activeCategory = params.get("category") || "all";

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        setIsProductsLoading(true);
        const data = await catalogService.getPublicProducts({
          page,
          pageSize,
          search: query.trim(),
          categoryId: activeCategory === "all" ? "" : activeCategory,
          sort
        });

        if (ignore) return;

        setProducts(normalizeProducts(data));
        setTotalPages(Math.max(Number(data.totalPages || 1), 1));
        setTotalItems(Number(data.totalItems || 0));
        setProductError("");
      } catch (error) {
        if (!ignore) {
          setProducts([]);
          setTotalPages(1);
          setTotalItems(0);
          setProductError(error.message || "Không thể tải sản phẩm từ máy chủ.");
        }
      } finally {
        if (!ignore) setIsProductsLoading(false);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [activeCategory, page, query, sort]);

  const setCategory = (category) => {
    setPage(1);

    if (category === "all") {
      setParams({});
    } else {
      setParams({ category: String(category) });
    }
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  if (isCatalogLoading && isProductsLoading) return <Loading />;

  return (
    <section className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">Tất cả sản phẩm</h1>
        <p className="section-subtitle">Tìm đồ mặc hằng ngày, đồ đi chơi và phụ kiện mềm mại cho bé.</p>
      </div>

      {(catalogError || productError) && <p className="mb-6 text-sm font-semibold text-berry">{productError || catalogError}</p>}

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
                onChange={handleSearchChange}
                placeholder="Tìm sản phẩm..."
                className="w-full rounded-2xl border border-cocoa/10 bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-berry focus:bg-white"
              />
            </label>
            <select
              value={sort}
              onChange={handleSortChange}
              className="rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm font-semibold text-cocoa outline-none focus:border-berry focus:bg-white"
            >
              <option value="featured">Sắp xếp nổi bật</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3 text-sm font-semibold text-cocoa/60">
            <span>{isProductsLoading ? "Đang tải sản phẩm..." : `${totalItems} sản phẩm`}</span>
            <span>
              Trang {page} / {totalPages}
            </span>
          </div>

          {products.length > 0 ? (
            <>
              <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${isProductsLoading ? "opacity-60" : ""}`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1 || isProductsLoading}
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                  className="inline-flex items-center gap-2 rounded-full border border-cocoa/10 bg-white px-5 py-3 text-sm font-bold text-cocoa transition hover:text-berry disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <ChevronLeft size={17} />
                  Trước
                </button>
                <span className="rounded-full bg-cream px-5 py-3 text-sm font-black text-cocoa">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages || isProductsLoading}
                  onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                  className="inline-flex items-center gap-2 rounded-full border border-cocoa/10 bg-white px-5 py-3 text-sm font-bold text-cocoa transition hover:text-berry disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Sau
                  <ChevronRight size={17} />
                </button>
              </div>
            </>
          ) : (
            <EmptyState title="Không tìm thấy sản phẩm" description="Thử đổi từ khóa hoặc chọn danh mục khác." />
          )}
        </div>
      </div>
    </section>
  );
}
