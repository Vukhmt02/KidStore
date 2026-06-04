import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { catalogService } from "../services/catalogService";

const CatalogContext = createContext(null);
const fallbackImage =
  "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80";
const categoryImages = [
  "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9e8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80"
];
const categoryColors = ["bg-peach", "bg-skysoft", "bg-mint", "bg-lemon"];

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      try {
        const [categoryData, productData] = await Promise.all([
          catalogService.getPublicCategories(),
          catalogService.getPublicProducts()
        ]);

        if (ignore) return;

        setCategories(normalizeCategories(categoryData));
        setProducts(normalizeProducts(productData));
        setError("");
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Không thể tải sản phẩm từ máy chủ.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo(
    () => ({ categories, products, isLoading, error }),
    [categories, products, isLoading, error]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalog must be used inside CatalogProvider");
  }

  return context;
}

function normalizeCategories(data) {
  return normalizeList(data).map((category, index) => ({
    id: String(category.id ?? category.categoryId),
    name: category.name ?? category.categoryName ?? `Danh mục ${index + 1}`,
    image: category.imageUrl || categoryImages[index % categoryImages.length],
    color: categoryColors[index % categoryColors.length]
  }));
}

function normalizeProducts(data) {
  return normalizeList(data).map((product) => {
    const images = [...(product.images ?? [])].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
    const variants = product.variants ?? [];
    const gallery = images.map((image) => image.imageUrl).filter(Boolean);
    const sizes = uniqueValues(variants.map((variant) => variant.sizeName || `Size ${variant.sizeId}`));
    const colors = uniqueValues(variants.map((variant) => variant.colorName || `Màu ${variant.colorId}`));

    return {
      ...product,
      category: String(product.categoryId),
      gallery: gallery.length ? gallery : [fallbackImage],
      image: images.find((image) => image.isMain)?.imageUrl || gallery[0] || fallbackImage,
      sizes: sizes.length ? sizes : ["Mặc định"],
      colors: colors.length ? colors : ["Mặc định"]
    };
  });
}

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}
