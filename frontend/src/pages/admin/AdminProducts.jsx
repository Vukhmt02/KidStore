import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import { categories as initialCategories, products as initialProducts } from "../../data/products";
import { catalogService } from "../../services/catalogService";
import { formatCurrency } from "../../utils/formatCurrency";

const fallbackSizeOptions = [
  { id: 1, label: "Size 1" },
  { id: 2, label: "Size 2" },
  { id: 3, label: "Size 3" }
];

const fallbackColorOptions = [
  { id: 1, label: "Trang", swatch: "bg-white" },
  { id: 2, label: "Den", swatch: "bg-[#222222]" },
  { id: 3, label: "Do", swatch: "bg-[#ef4444]" },
  { id: 4, label: "Xanh", swatch: "bg-[#3b82f6]" },
  { id: 5, label: "Vang", swatch: "bg-[#facc15]" },
  { id: 6, label: "Hong", swatch: "bg-[#f9a8d4]" }
];

const emptyImage = { imageUrl: "", isMain: true, sortOrder: 0 };

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [sizeOptions, setSizeOptions] = useState(fallbackSizeOptions);
  const [colorOptions, setColorOptions] = useState(fallbackColorOptions);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadCatalogData() {
      setIsLoading(true);
      const errors = [];

      const [productResult, categoryResult, sizeResult, colorResult] = await Promise.allSettled([
        catalogService.getProducts(),
        catalogService.getCategories(),
        catalogService.getSizes(),
        catalogService.getColors()
      ]);

      if (ignore) return;

      if (categoryResult.status === "fulfilled") {
        const normalizedCategories = normalizeCategories(categoryResult.value);
        setCategories(normalizedCategories);
      } else {
        errors.push("danh muc");
        setCategories(initialCategories);
      }

      if (productResult.status === "fulfilled") {
        const normalizedProducts = normalizeProducts(productResult.value);
        setProducts(normalizedProducts);
      } else {
        errors.push("san pham");
        setProducts(initialProducts);
      }

      if (sizeResult.status === "fulfilled") {
        const normalizedSizes = normalizeSizes(sizeResult.value);
        setSizeOptions(normalizedSizes.length ? normalizedSizes : fallbackSizeOptions);
      } else {
        setSizeOptions(fallbackSizeOptions);
      }

      if (colorResult.status === "fulfilled") {
        const normalizedColors = normalizeColors(colorResult.value);
        setColorOptions(normalizedColors.length ? normalizedColors : fallbackColorOptions);
      } else {
        setColorOptions(fallbackColorOptions);
      }

      setLoadError(errors.length ? `Khong the tai ${errors.join(", ")} tu backend` : "");
      setIsLoading(false);
    }

    loadCatalogData();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(
    () =>
      products
        .filter((product) => category === "all" || String(product.categoryId ?? product.category) === category)
        .filter((product) => product.name.toLowerCase().includes(query.toLowerCase().trim())),
    [category, products, query]
  );

  const handleDelete = async (productId) => {
    if (!window.confirm("Xoa san pham nay?")) return;

    try {
      setActionError("");
      await catalogService.deleteProduct(productId);
      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
    } catch (error) {
      setActionError(error.message || "Khong the xoa san pham");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Quan ly san pham</h2>
          <p className="mt-2 text-sm text-cocoa/60">Them, sua, an hien va theo doi san pham KidStore.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Them san pham
        </Button>
      </div>

      {loadError && (
        <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">
          {loadError}. Dang hien du lieu mau.
        </p>
      )}

      {actionError && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{actionError}</p>}

      <div className="rounded-[1.5rem] border border-cocoa/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/45" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tim san pham..."
              className="w-full rounded-2xl border border-cocoa/10 bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-berry focus:bg-white"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm font-semibold outline-none focus:border-berry focus:bg-white"
          >
            <option value="all">Tat ca danh muc</option>
            {categories.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase text-cocoa/45">
              <tr>
                <th className="py-3">San pham</th>
                <th>Danh muc</th>
                <th>Gia</th>
                <th>Ton kho</th>
                <th>Trang thai</th>
                <th className="text-right">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/10">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
                      <div>
                        <p className="font-bold text-cocoa">{product.name}</p>
                        <p className="text-xs text-cocoa/50">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.categoryName ?? product.categoryId ?? product.category}</td>
                  <td className="font-bold text-berry">{formatCurrency(product.price)}</td>
                  <td>{product.stockQuantity ?? product.variants?.reduce((total, item) => total + Number(item.stockQuantity || 0), 0) ?? "-"}</td>
                  <td>
                    <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-cocoa">Dang ban</span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-full bg-cream p-2 text-cocoa hover:text-berry"
                        type="button"
                        aria-label="Sua"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit size={17} />
                      </button>
                      <button
                        className="rounded-full bg-cream p-2 text-cocoa hover:text-berry"
                        type="button"
                        aria-label="Xoa"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && <p className="mt-4 text-sm font-semibold text-cocoa/55">Dang tai san pham tu backend...</p>}
      </div>

      {showCreateModal && (
        <CreateProductModal
          categories={categories}
          colorOptions={colorOptions}
          onClose={() => setShowCreateModal(false)}
          onCreate={(newProduct) => {
            setProducts((currentProducts) => [newProduct, ...currentProducts]);
            setShowCreateModal(false);
          }}
          sizeOptions={sizeOptions}
        />
      )}

      {editingProduct && (
        <CreateProductModal
          categories={categories}
          colorOptions={colorOptions}
          onClose={() => setEditingProduct(null)}
          onCreate={(updatedProduct) => {
            setProducts((currentProducts) =>
              currentProducts.map((product) => (product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product))
            );
            setEditingProduct(null);
          }}
          product={editingProduct}
          sizeOptions={sizeOptions}
        />
      )}
    </div>
  );
}

function CreateProductModal({ categories, colorOptions, onClose, onCreate, product, sizeOptions }) {
  const isEditing = Boolean(product);
  const [variants, setVariants] = useState(
    product?.variants?.length ? product.variants.map(normalizeVariantForForm) : [createEmptyVariant(sizeOptions, colorOptions)]
  );
  const [images, setImages] = useState(
    product?.images?.length
      ? product.images.map(normalizeImageForForm)
      : product?.gallery?.length
        ? product.gallery.map((imageUrl, index) => ({ imageUrl, isMain: index === 0, sortOrder: index }))
        : [{ ...emptyImage }]
  );
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateVariant = (index, field, value) => {
    setVariants((currentVariants) =>
      currentVariants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: Number(value) } : variant
      )
    );
  };

  const updateImage = (index, field, value) => {
    setImages((currentImages) =>
      currentImages.map((image, imageIndex) => (imageIndex === index ? { ...image, [field]: value } : image))
    );
  };

  const getColorOption = (colorId) => colorOptions.find((color) => color.id === Number(colorId)) ?? colorOptions[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      categoryId: Number(form.get("categoryId")),
      name: form.get("name")?.trim(),
      description: form.get("description")?.trim(),
      price: Number(form.get("price")),
      discountPrice: Number(form.get("discountPrice") || 0),
      ...(isEditing ? { isActive: true } : {}),
      variants,
      images: images.map((image, index) => ({
        ...(image.id ? { id: image.id } : {}),
        imageUrl: image.imageUrl.trim(),
        isMain: index === 0 ? true : Boolean(image.isMain),
        sortOrder: Number(image.sortOrder || index)
      }))
    };
    const nextErrors = {};

    if (!payload.categoryId || payload.categoryId <= 0) nextErrors.categoryId = "Vui long nhap categoryId";
    if (!payload.name) nextErrors.name = "Vui long nhap ten san pham";
    if (!payload.description) nextErrors.description = "Vui long nhap mo ta";
    if (!payload.price || payload.price <= 0) nextErrors.price = "Gia san pham chua hop le";
    if (payload.discountPrice < 0) nextErrors.discountPrice = "Gia giam khong hop le";
    if (!payload.variants.length) nextErrors.variants = "Nhap it nhat 1 bien the";
    if (payload.variants.some((variant) => variant.sizeId <= 0 || variant.colorId <= 0)) {
      nextErrors.variants = "SizeId va colorId phai lon hon 0";
    }
    if (payload.variants.some((variant) => variant.extraPrice < 0 || variant.stockQuantity < 0)) {
      nextErrors.variants = "Gia phu va ton kho khong duoc am";
    }
    if (!payload.images.length || payload.images.some((image) => !image.imageUrl)) {
      nextErrors.images = "Nhap URL anh san pham";
    }

    setErrors(nextErrors);
    setApiError("");
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const savedProduct = isEditing
        ? await catalogService.updateProduct(product.id, payload)
        : await catalogService.createProduct(payload);
      const mainImage = payload.images.find((image) => image.isMain) ?? payload.images[0];

      onCreate({
        id: product?.id ?? savedProduct?.id ?? savedProduct?.productId ?? Date.now(),
        ...payload,
        image: savedProduct?.imageUrl ?? mainImage.imageUrl,
        category: String(payload.categoryId),
        categoryName: savedProduct?.categoryName,
        stockQuantity: payload.variants.reduce((total, item) => total + Number(item.stockQuantity || 0), 0),
        sizes: payload.variants.map((variant) => `Size ${variant.sizeId}`),
        colors: payload.variants.map((variant) => `Color ${variant.colorId}`),
        gallery: payload.images.map((image) => image.imageUrl),
        badge: "Moi"
      });
    } catch (error) {
      setApiError(error.message || "Khong the them san pham");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-cocoa/35 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl rounded-[1.75rem] bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-cocoa">{isEditing ? "Sua san pham" : "Them san pham"}</h3>
            <p className="mt-1 text-sm text-cocoa/60">
              {isEditing ? "Cap nhat san pham trong backend." : "Nhap thong tin san pham, bien the size/mau va hinh anh."}
            </p>
          </div>
          <button className="rounded-full bg-cream p-2 text-cocoa hover:text-berry" type="button" onClick={onClose} aria-label="Dong">
            <X size={20} />
          </button>
        </div>

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <section className="rounded-3xl border border-cocoa/10 p-4">
            <SectionTitle title="Thong tin co ban" description="Cac truong nay tuong ung voi categoryId, name, description, price va discountPrice." />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Ma danh muc" hint="categoryId" error={errors.categoryId}>
                <select name="categoryId" className={inputClassName} defaultValue={product?.categoryId ?? categories[0]?.id ?? ""}>
                  <option value="" disabled>
                    Chon danh muc
                  </option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Ten san pham" hint="name" error={errors.name}>
                <input name="name" defaultValue={product?.name ?? ""} className={inputClassName} placeholder="Ao thun pastel" />
              </FormField>

              <FormField label="Gia ban" hint="price" error={errors.price}>
                <input name="price" type="number" min="0" defaultValue={product?.price ?? ""} className={inputClassName} placeholder="199000" />
              </FormField>

              <FormField label="Gia giam" hint="discountPrice" error={errors.discountPrice}>
                <input name="discountPrice" type="number" min="0" defaultValue={product?.discountPrice ?? 0} className={inputClassName} />
              </FormField>

              <FormField label="Mo ta" hint="description" error={errors.description} className="sm:col-span-2">
                <textarea name="description" rows="3" defaultValue={product?.description ?? ""} className={inputClassName} placeholder="Mo ta ngan ve san pham" />
              </FormField>
            </div>
          </section>

          <section className="rounded-3xl border border-cocoa/10 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <SectionTitle title="Bien the san pham" description="Moi dong la mot ket hop size, mau, gia cong them va so luong ton kho." />
              <Button type="button" variant="secondary" size="sm" onClick={() => setVariants((current) => [...current, createEmptyVariant(sizeOptions, colorOptions)])}>
                <Plus size={16} />
                Them bien the
              </Button>
            </div>
            <div className="mt-4 grid gap-3">
              {variants.map((variant, index) => (
                <div key={index} className="grid gap-3 rounded-2xl bg-cream p-3 lg:grid-cols-[140px_180px_1fr_1fr_96px]">
                  <MiniField label="Size">
                    <select value={variant.sizeId} onChange={(event) => updateVariant(index, "sizeId", event.target.value)} className={inputClassName}>
                      {sizeOptions.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </MiniField>

                  <MiniField label="Mau">
                    <div className="relative">
                      <span className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-cocoa/15 ${getColorOption(variant.colorId).swatch}`} />
                      <select value={variant.colorId} onChange={(event) => updateVariant(index, "colorId", event.target.value)} className={`${inputClassName} pl-10`}>
                        {colorOptions.map((color) => (
                          <option key={color.id} value={color.id}>
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </MiniField>

                  <MiniField label="Gia cong them">
                    <input type="number" min="0" value={variant.extraPrice} onChange={(event) => updateVariant(index, "extraPrice", event.target.value)} className={inputClassName} placeholder="0" />
                  </MiniField>

                  <MiniField label="Ton kho">
                    <input type="number" min="0" value={variant.stockQuantity} onChange={(event) => updateVariant(index, "stockQuantity", event.target.value)} className={inputClassName} placeholder="0" />
                  </MiniField>

                  <button
                    type="button"
                    className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-3 text-sm font-bold text-cocoa hover:text-berry disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={variants.length === 1}
                    onClick={() => setVariants((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    aria-label="Xoa bien the"
                  >
                    <Trash2 size={16} />
                    Xoa
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs font-semibold text-cocoa/50">
              He thong tu gui ma size va ma mau tuong ung trong co so du lieu.
            </p>
            {errors.variants && <span className="mt-2 block text-xs font-semibold text-berry">{errors.variants}</span>}
          </section>

          <section className="rounded-3xl border border-cocoa/10 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <SectionTitle title="Hinh anh san pham" description="Anh dau tien se duoc gui voi isMain = true." />
              <Button type="button" variant="secondary" size="sm" onClick={() => setImages((current) => [...current, { ...emptyImage, isMain: false, sortOrder: current.length }])}>
                <Plus size={16} />
                Them anh
              </Button>
            </div>
            <div className="mt-4 grid gap-3">
              {images.map((image, index) => (
                <div key={index} className="grid gap-3 rounded-2xl bg-cream p-3 lg:grid-cols-[96px_1fr_120px_96px]">
                  <div className="flex h-16 items-center justify-center overflow-hidden rounded-2xl border border-cocoa/10 bg-white">
                    {image.imageUrl ? (
                      <img src={image.imageUrl} alt={`Anh ${index + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-cocoa/35">Anh</span>
                    )}
                  </div>

                  <MiniField label={index === 0 ? "URL anh chinh" : "URL anh phu"}>
                    <input value={image.imageUrl} onChange={(event) => updateImage(index, "imageUrl", event.target.value)} className={inputClassName} placeholder="https://..." />
                  </MiniField>

                  <MiniField label="Thu tu">
                    <input type="number" min="0" value={image.sortOrder} onChange={(event) => updateImage(index, "sortOrder", Number(event.target.value))} className={inputClassName} placeholder="0" />
                  </MiniField>

                  <button
                    type="button"
                    className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-3 text-sm font-bold text-cocoa hover:text-berry disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={images.length === 1}
                    onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    aria-label="Xoa anh"
                  >
                    <Trash2 size={16} />
                    Xoa
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs font-semibold text-cocoa/50">Anh dau tien se duoc dat isMain = true.</p>
            {errors.images && <span className="mt-2 block text-xs font-semibold text-berry">{errors.images}</span>}
          </section>

          {apiError && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{apiError}</p>}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={onClose}>
              Huy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Dang luu..." : isEditing ? "Luu thay doi" : "Luu san pham"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm outline-none focus:border-berry";

function SectionTitle({ description, title }) {
  return (
    <div>
      <h4 className="font-black text-cocoa">{title}</h4>
      <p className="mt-1 text-sm text-cocoa/55">{description}</p>
    </div>
  );
}

function FormField({ children, className = "", error, hint, label }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 flex items-center justify-between gap-2 text-sm font-bold text-cocoa">
        {label}
        {hint && <span className="text-xs font-semibold text-cocoa/40">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-2 block text-xs font-semibold text-berry">{error}</span>}
    </label>
  );
}

function MiniField({ children, label }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-cocoa/45">{label}</span>
      {children}
    </label>
  );
}

function createEmptyVariant(sizeOptions, colorOptions) {
  return {
    sizeId: sizeOptions[0]?.id ?? 1,
    colorId: colorOptions[0]?.id ?? 1,
    extraPrice: 0,
    stockQuantity: 0
  };
}

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

function normalizeCategories(data) {
  return normalizeList(data).map((category, index) => ({
    id: category.id ?? category.categoryId,
    name: category.name ?? category.categoryName ?? `Danh muc ${index + 1}`
  }));
}

function normalizeSizes(data) {
  return normalizeList(data).map((size, index) => ({
    id: size.id ?? size.sizeId,
    label: size.name ?? size.sizeName ?? size.label ?? `Size ${index + 1}`
  }));
}

function normalizeColors(data) {
  return normalizeList(data).map((color, index) => ({
    id: color.id ?? color.colorId,
    label: color.name ?? color.colorName ?? color.label ?? `Mau ${index + 1}`,
    swatch: getColorSwatch(color.name ?? color.colorName ?? color.label)
  }));
}

function normalizeProducts(data) {
  return normalizeList(data).map((product) => {
    const images = product.images ?? product.productImages ?? [];
    const mainImage = images.find((image) => image.isMain) ?? images[0];
    const variants = product.variants ?? product.productVariants ?? [];

    return {
      id: product.id ?? product.productId,
      name: product.name ?? product.productName ?? "San pham",
      price: product.price ?? 0,
      discountPrice: product.discountPrice ?? 0,
      description: product.description ?? "",
      categoryId: product.categoryId ?? product.category?.id,
      categoryName: product.categoryName ?? product.category?.name,
      image:
        product.image ||
        product.imageUrl ||
        mainImage?.imageUrl ||
        "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80",
      variants,
      images,
      stockQuantity: variants.reduce((total, variant) => total + Number(variant.stockQuantity || 0), 0),
      sizes: variants.map((variant) => `Size ${variant.sizeId}`),
      colors: variants.map((variant) => `Color ${variant.colorId}`),
      gallery: images.map((image) => image.imageUrl).filter(Boolean)
    };
  });
}

function normalizeVariantForForm(variant) {
  return {
    ...(variant.id ? { id: variant.id } : {}),
    sizeId: variant.sizeId ?? 1,
    colorId: variant.colorId ?? 1,
    extraPrice: variant.extraPrice ?? 0,
    stockQuantity: variant.stockQuantity ?? 0
  };
}

function normalizeImageForForm(image, index) {
  return {
    ...(image.id ? { id: image.id } : {}),
    imageUrl: image.imageUrl ?? "",
    isMain: image.isMain ?? index === 0,
    sortOrder: image.sortOrder ?? index
  };
}

function getColorSwatch(name = "") {
  const normalizedName = String(name).toLowerCase();

  if (normalizedName.includes("den") || normalizedName.includes("black")) return "bg-[#222222]";
  if (normalizedName.includes("do") || normalizedName.includes("red")) return "bg-[#ef4444]";
  if (normalizedName.includes("xanh") || normalizedName.includes("blue")) return "bg-[#3b82f6]";
  if (normalizedName.includes("vang") || normalizedName.includes("yellow")) return "bg-[#facc15]";
  if (normalizedName.includes("hong") || normalizedName.includes("pink")) return "bg-[#f9a8d4]";
  if (normalizedName.includes("trang") || normalizedName.includes("white")) return "bg-white";

  return "bg-mint";
}
