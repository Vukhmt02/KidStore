import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Minus, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { normalizeProducts, useCatalog } from "../hooks/useCatalog";
import { catalogService } from "../services/catalogService";
import { formatCurrency } from "../utils/formatCurrency";

const pageSize = 15; // 3 hàng x 5 sản phẩm

const POPULAR_COLORS = [
  { id: "white", name: "Trắng", hex: "#FFFFFF" },
  { id: "black", name: "Đen", hex: "#000000" },
  { id: "pink", name: "Hồng", hex: "#FFC0CB" },
  { id: "blue", name: "Xanh", hex: "#87CEEB" },
  { id: "yellow", name: "Vàng", hex: "#FFE4B5" },
  { id: "gray", name: "Xám", hex: "#D3D3D3" }
];

const TARGET_AUDIENCES = [
  { id: "boy", name: "Bé trai" },
  { id: "girl", name: "Bé gái" },
  { id: "baby", name: "Trẻ sơ sinh" }
];

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

  // Sidebar filters accordion states
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Price range state
  const [maxPrice, setMaxPrice] = useState(1000000);

  // Selected filters
  const activeCategory = params.get("category") || "all";
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTargets, setSelectedTargets] = useState([]);

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

  const setCategory = (categoryId) => {
    setPage(1);
    if (categoryId === "all") {
      setParams({});
    } else {
      setParams({ category: String(categoryId) });
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

  const toggleColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleTarget = (targetName) => {
    setSelectedTargets((prev) =>
      prev.includes(targetName) ? prev.filter((t) => t !== targetName) : [...prev, targetName]
    );
  };

  // Client-side filtering for price, color & target
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = Number(product.discountPrice || product.price || 0);
      if (price > maxPrice) return false;

      if (selectedColors.length > 0) {
        const productColors = (product.colors || []).map((c) => c.toLowerCase());
        const matchColor = selectedColors.some((c) =>
          productColors.some((pc) => pc.includes(c.toLowerCase()))
        );
        if (!matchColor) return false;
      }

      if (selectedTargets.length > 0) {
        const text = `${product.name} ${product.description || ""}`.toLowerCase();
        const matchTarget = selectedTargets.some((t) => text.includes(t.toLowerCase()));
        if (!matchTarget) return false;
      }

      return true;
    });
  }, [products, maxPrice, selectedColors, selectedTargets]);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);
  const activeCategoryObj = categories.find((c) => String(c.id) === String(activeCategory));
  const currentCategoryName = activeCategory === "all" ? "Thời trang trẻ em KidStore" : activeCategoryObj?.name || "Sản phẩm";

  if (isCatalogLoading && isProductsLoading) return <Loading />;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-red-600 transition">
          Trang chủ
        </Link>
        <span>|</span>
        <span className="font-semibold text-gray-900">{currentCategoryName}</span>
      </nav>

      {/* Tiêu đề trang & Đường kẻ nét đứt */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentCategoryName}</h1>
        <div className="mt-3.5 border-b border-dashed border-gray-300" />
      </div>

      {(catalogError || productError) && (
        <p className="mb-6 text-sm font-semibold text-red-600">{productError || catalogError}</p>
      )}

      {/* Bố cục: Cột bộ lọc bên trái (220px) + Danh sách 5 sản phẩm/hàng bên phải */}
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* SIDEBAR BỘ LỌC (Phong cách TokyoLife) */}
        <aside className="h-fit">
          {/* Bộ lọc 1: Sắp xếp khoảng giá */}
          <div className="border-b border-gray-200 pb-5">
            <button
              type="button"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="flex w-full items-center justify-between text-left text-sm font-bold text-gray-900"
            >
              <span>Sắp xếp khoảng giá</span>
              {isPriceOpen ? <Minus size={15} /> : <Plus size={15} />}
            </button>

            {isPriceOpen && (
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-red-600"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                  <span>0</span>
                  <span className="font-medium text-red-600">{formatCurrency(maxPrice)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bộ lọc 2: Màu sắc */}
          <div className="border-b border-gray-200 py-4">
            <button
              type="button"
              onClick={() => setIsColorOpen(!isColorOpen)}
              className="flex w-full items-center justify-between text-left text-sm font-bold text-gray-900"
            >
              <span>Màu sắc</span>
              {isColorOpen ? <Minus size={15} /> : <Plus size={15} />}
            </button>

            {isColorOpen && (
              <div className="mt-3.5 space-y-2">
                {POPULAR_COLORS.map((color) => (
                  <label
                    key={color.id}
                    className="flex cursor-pointer items-center gap-2.5 text-xs text-gray-700 hover:text-red-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.name)}
                      onChange={() => toggleColor(color.name)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-red-600 accent-red-600 focus:ring-red-500"
                    />
                    <span
                      className="h-3 w-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Bộ lọc 3: Danh mục (Accordion mở sẵn) */}
          <div className="border-b border-gray-200 py-4">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex w-full items-center justify-between text-left text-sm font-bold text-gray-900"
            >
              <span>Danh mục</span>
              {isCategoryOpen ? <Minus size={15} /> : <Plus size={15} />}
            </button>

            {isCategoryOpen && (
              <div className="mt-3.5 space-y-2.5">
                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-gray-700 hover:text-red-600">
                  <input
                    type="checkbox"
                    checked={activeCategory === "all"}
                    onChange={() => setCategory("all")}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-red-600 accent-red-600 focus:ring-red-500"
                  />
                  <span className={activeCategory === "all" ? "font-bold text-red-600" : ""}>
                    Tất cả danh mục
                  </span>
                </label>

                {displayedCategories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-2.5 text-xs text-gray-700 hover:text-red-600"
                  >
                    <input
                      type="checkbox"
                      checked={String(activeCategory) === String(category.id)}
                      onChange={() => setCategory(category.id)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-red-600 accent-red-600 focus:ring-red-500"
                    />
                    <span
                      className={
                        String(activeCategory) === String(category.id)
                          ? "font-bold text-red-600"
                          : ""
                      }
                    >
                      {category.name}
                    </span>
                  </label>
                ))}

                {categories.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <span>{showAllCategories ? "Thu gọn ↑" : "Xem tất cả ↓"}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bộ lọc 4: Đối tượng */}
          <div className="border-b border-gray-200 py-4">
            <button
              type="button"
              onClick={() => setIsTargetOpen(!isTargetOpen)}
              className="flex w-full items-center justify-between text-left text-sm font-bold text-gray-900"
            >
              <span>Đối tượng</span>
              {isTargetOpen ? <Minus size={15} /> : <Plus size={15} />}
            </button>

            {isTargetOpen && (
              <div className="mt-3.5 space-y-2">
                {TARGET_AUDIENCES.map((target) => (
                  <label
                    key={target.id}
                    className="flex cursor-pointer items-center gap-2.5 text-xs text-gray-700 hover:text-red-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTargets.includes(target.name)}
                      onChange={() => toggleTarget(target.name)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-red-600 accent-red-600 focus:ring-red-500"
                    />
                    <span>{target.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* KHU VỰC SẢN PHẨM (5 SẢN PHẨM TRÊN 1 HÀNG) */}
        <div>
          {/* Thanh trên cùng: Sắp xếp & Tìm kiếm */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Sắp xếp theo</span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-800 outline-none focus:border-red-500"
              >
                <option value="featured">Mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-48 sm:w-60">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
                <input
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Tìm sản phẩm..."
                  className="w-full rounded border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-xs sm:text-sm outline-none focus:border-red-500"
                />
              </div>

              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                {isProductsLoading ? "Đang tải..." : `${totalItems} sản phẩm`}
              </span>
            </div>
          </div>

          {/* LƯỚI 5 SẢN PHẨM / HÀNG */}
          {filteredProducts.length > 0 ? (
            <>
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-7 ${
                  isProductsLoading ? "opacity-60" : ""
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Phân trang */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isProductsLoading}
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                  className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded text-xs font-bold transition ${
                      page === p
                        ? "bg-red-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:text-red-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= totalPages || isProductsLoading}
                  onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                  className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sau
                  <ChevronRight size={15} />
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              title="Không tìm thấy sản phẩm"
              description="Thử đổi từ khóa hoặc điều chỉnh khoảng giá, danh mục."
            />
          )}
        </div>
      </div>
    </section>
  );
}
