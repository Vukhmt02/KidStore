import { Edit, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { categories as initialCategories, products } from "../../data/products";
import { catalogService } from "../../services/catalogService";

const categoryColors = ["bg-peach", "bg-skysoft", "bg-mint", "bg-lemon"];

export default function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        setIsLoading(true);
        const [categoryData, productData] = await Promise.all([
          catalogService.getCategories(),
          catalogService.getProducts().catch(() => [])
        ]);

        if (ignore) return;

        const normalizedCategories = normalizeList(categoryData).map((category, index) => ({
          id: category.id ?? category.categoryId,
          name: category.name ?? category.categoryName ?? `Danh mục ${index + 1}`,
          image:
            category.image ||
            category.imageUrl ||
            "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
          color: categoryColors[index % categoryColors.length]
        }));

        const counts = normalizeList(productData).reduce((result, product) => {
          const categoryId = product.categoryId ?? product.category?.id;
          if (categoryId) result[categoryId] = (result[categoryId] || 0) + 1;
          return result;
        }, {});

        setCategories(normalizedCategories.length ? normalizedCategories : initialCategories);
        setProductsByCategory(counts);
        setLoadError("");
      } catch (error) {
        if (!ignore) {
          setLoadError(error.message || "Không thể tải danh mục từ máy chủ");
          setCategories(initialCategories);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Xóa danh mục này?")) return;

    try {
      setActionError("");
      await catalogService.deleteCategory(categoryId);
      setCategories((currentCategories) => currentCategories.filter((category) => category.id !== categoryId));
    } catch (error) {
      setActionError(error.message || "Không thể xóa danh mục");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Quản lý danh mục</h2>
          <p className="mt-2 text-sm text-cocoa/60">Sắp xếp danh mục hiển thị trên website KidStore.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Thêm danh mục
        </Button>
      </div>

      {loadError && (
        <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">
          {loadError}. Đang hiển thị dữ liệu mẫu.
        </p>
      )}

      {actionError && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{actionError}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const total = productsByCategory[category.id] ?? products.filter((product) => product.category === category.id).length;
          return (
            <article key={category.id} className="overflow-hidden rounded-[1.5rem] border border-cocoa/10 bg-white shadow-sm">
              <img src={category.image} alt={category.name} className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-cocoa">{category.name}</h3>
                    <p className="mt-1 text-sm text-cocoa/60">{total} san pham</p>
                  </div>
                  <span className={`h-8 w-8 rounded-full ${category.color}`} />
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cream px-3 py-2 text-sm font-bold text-cocoa hover:text-berry"
                    type="button"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit size={16} />
                    Sua
                  </button>
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cream px-3 py-2 text-sm font-bold text-cocoa hover:text-berry"
                    type="button"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 size={16} />
                    Xoa
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {isLoading && <p className="text-sm font-semibold text-cocoa/55">Đang tải danh mục từ máy chủ...</p>}

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newCategory) => {
            setCategories((currentCategories) => [newCategory, ...currentCategories]);
            setShowCreateModal(false);
          }}
          nextColor={categoryColors[categories.length % categoryColors.length]}
        />
      )}

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onUpdate={(updatedCategory) => {
            setCategories((currentCategories) =>
              currentCategories.map((category) => (category.id === updatedCategory.id ? { ...category, ...updatedCategory } : category))
            );
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

function CreateCategoryModal({ nextColor, onClose, onCreate }) {
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name")?.trim();

    setError("");
    setApiError("");

    if (!name) {
      setError("Vui lòng nhập tên danh mục");
      return;
    }

    const payload = { name };

    try {
      setIsSubmitting(true);
      const createdCategory = await catalogService.createCategory(payload);

      onCreate({
        id: createdCategory?.id ?? createdCategory?.categoryId ?? Date.now(),
        name: createdCategory?.name ?? name,
        image:
          createdCategory?.image ||
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
        color: nextColor
      });
    } catch (error) {
      setApiError(error.message || "Không thể thêm danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-cocoa/35 px-4 py-8">
      <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-cocoa">Thêm danh mục</h3>
            <p className="mt-1 text-sm text-cocoa/60">Payload gui API: name.</p>
          </div>
          <button className="rounded-full bg-cream p-2 text-cocoa hover:text-berry" type="button" onClick={onClose} aria-label="Dong">
            <X size={20} />
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-cocoa">Tên danh mục</span>
            <input
              name="name"
              className="w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm outline-none focus:border-berry focus:bg-white"
              placeholder="Quan ao be gai"
            />
            {error && <span className="mt-2 block text-xs font-semibold text-berry">{error}</span>}
          </label>

          {apiError && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{apiError}</p>}

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu danh mục"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCategoryModal({ category, onClose, onUpdate }) {
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name")?.trim();

    setError("");
    setApiError("");

    if (!name) {
      setError("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setIsSubmitting(true);
      await catalogService.updateCategory(category.id, { name, isActive: true });
      onUpdate({ ...category, name });
    } catch (error) {
      setApiError(error.message || "Không thể cập nhật danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-cocoa/35 px-4 py-8">
      <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-cocoa">Sửa danh mục</h3>
            <p className="mt-1 text-sm text-cocoa/60">Cập nhật tên danh mục trên máy chủ.</p>
          </div>
          <button className="rounded-full bg-cream p-2 text-cocoa hover:text-berry" type="button" onClick={onClose} aria-label="Dong">
            <X size={20} />
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-cocoa">Tên danh mục</span>
            <input
              name="name"
              defaultValue={category.name}
              className="w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm outline-none focus:border-berry focus:bg-white"
            />
            {error && <span className="mt-2 block text-xs font-semibold text-berry">{error}</span>}
          </label>

          {apiError && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{apiError}</p>}

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
