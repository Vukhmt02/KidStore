import { Edit, Eye, EyeOff, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { newsService } from "../../services/newsService";

const emptyArticle = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  imageUrl: "",
  youtubeUrl: "",
  isPublished: true
};

export default function AdminNews() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingArticle, setEditingArticle] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadNews() {
      try {
        setIsLoading(true);
        const data = await newsService.getAll();
        if (!ignore) {
          setArticles(Array.isArray(data) ? data : []);
          setLoadError("");
        }
      } catch (error) {
        if (!ignore) setLoadError(error.message || "Không thể tải tin tức từ máy chủ");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadNews();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (articleId) => {
    if (!window.confirm("Xóa tin tức này?")) return;

    try {
      setActionError("");
      await newsService.delete(articleId);
      setArticles((currentArticles) => currentArticles.filter((article) => article.id !== articleId));
    } catch (error) {
      setActionError(error.message || "Không thể xóa tin tức");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Quản lý tin tức</h2>
          <p className="mt-2 text-sm text-cocoa/60">Thêm, sửa, xóa bài viết và nhúng video YouTube lên website.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Thêm tin tức
        </Button>
      </div>

      {loadError && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{loadError}</p>}
      {actionError && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{actionError}</p>}

      <div className="overflow-hidden rounded-[1.5rem] border border-cocoa/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-cocoa/45">
              <tr>
                <th className="px-5 py-4">Tin tức</th>
                <th>Slug</th>
                <th>Video</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/10">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={article.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80"}
                        alt={article.title}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-cocoa">{article.title}</p>
                        <p className="line-clamp-1 text-xs text-cocoa/50">{article.summary || "Chưa có mô tả ngắn"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold text-cocoa/60">{article.slug}</td>
                  <td>{article.youtubeVideoId ? "Có" : "Không"}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${article.isPublished ? "bg-mint text-cocoa" : "bg-cream text-cocoa/60"}`}>
                      {article.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                      {article.isPublished ? "Đang hiển thị" : "Đang ẩn"}
                    </span>
                  </td>
                  <td>{formatDate(article.createdAt)}</td>
                  <td className="px-5">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-full bg-cream p-2 text-cocoa hover:text-berry" type="button" onClick={() => setEditingArticle(article)} aria-label="Sửa">
                        <Edit size={17} />
                      </button>
                      <button className="rounded-full bg-cream p-2 text-cocoa hover:text-berry" type="button" onClick={() => handleDelete(article.id)} aria-label="Xóa">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading && <p className="px-5 py-4 text-sm font-semibold text-cocoa/55">Đang tải tin tức...</p>}
        {!isLoading && !articles.length && <p className="px-5 py-8 text-center text-sm font-semibold text-cocoa/55">Chưa có tin tức nào.</p>}
      </div>

      {showCreateModal && (
        <NewsModal
          onClose={() => setShowCreateModal(false)}
          onSave={(createdArticle) => {
            setArticles((currentArticles) => [createdArticle, ...currentArticles]);
            setShowCreateModal(false);
          }}
        />
      )}

      {editingArticle && (
        <NewsModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSave={(updatedArticle) => {
            setArticles((currentArticles) =>
              currentArticles.map((article) => (article.id === updatedArticle.id ? updatedArticle : article))
            );
            setEditingArticle(null);
          }}
        />
      )}
    </div>
  );
}

function NewsModal({ article, onClose, onSave }) {
  const isEditing = Boolean(article);
  const [formData, setFormData] = useState(article || emptyArticle);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug?.trim() || null,
      summary: formData.summary?.trim() || null,
      content: formData.content?.trim() || null,
      imageUrl: formData.imageUrl?.trim() || null,
      youtubeUrl: formData.youtubeUrl?.trim() || null,
      isPublished: Boolean(formData.isPublished)
    };
    const nextErrors = {};

    if (!payload.title) nextErrors.title = "Vui lòng nhập tiêu đề";

    setErrors(nextErrors);
    setApiError("");
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const savedArticle = isEditing ? await newsService.update(article.id, payload) : await newsService.create(payload);
      onSave(savedArticle);
    } catch (error) {
      setApiError(error.message || "Không thể lưu tin tức");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-cocoa/35 px-4 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-[1.75rem] bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-cocoa">{isEditing ? "Sửa tin tức" : "Thêm tin tức"}</h3>
            <p className="mt-1 text-sm text-cocoa/60">Slug có thể để trống, hệ thống sẽ tự tạo từ tiêu đề.</p>
          </div>
          <button className="rounded-full bg-cream p-2 text-cocoa hover:text-berry" type="button" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Tiêu đề" hint="title" error={errors.title}>
              <input value={formData.title} onChange={(event) => updateField("title", event.target.value)} className={inputClassName} placeholder="Bộ sưu tập hè cho bé" />
            </FormField>

            <FormField label="Slug" hint="slug">
              <input value={formData.slug || ""} onChange={(event) => updateField("slug", event.target.value)} className={inputClassName} placeholder="bo-suu-tap-he-cho-be" />
            </FormField>

            <FormField label="URL ảnh đại diện" hint="imageUrl" className="sm:col-span-2">
              <input value={formData.imageUrl || ""} onChange={(event) => updateField("imageUrl", event.target.value)} className={inputClassName} placeholder="https://..." />
            </FormField>

            <FormField label="URL YouTube" hint="youtubeUrl" className="sm:col-span-2">
              <input value={formData.youtubeUrl || ""} onChange={(event) => updateField("youtubeUrl", event.target.value)} className={inputClassName} placeholder="https://www.youtube.com/watch?v=..." />
            </FormField>

            <FormField label="Mô tả ngắn" hint="summary" className="sm:col-span-2">
              <textarea value={formData.summary || ""} onChange={(event) => updateField("summary", event.target.value)} rows="3" className={inputClassName} placeholder="Tóm tắt ngắn hiển thị ngoài danh sách tin tức" />
            </FormField>

            <FormField label="Nội dung" hint="content" className="sm:col-span-2">
              <textarea value={formData.content || ""} onChange={(event) => updateField("content", event.target.value)} rows="8" className={inputClassName} placeholder="Nhập nội dung bài viết. Cách đoạn bằng một dòng trống." />
            </FormField>
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-cocoa">
            <input
              type="checkbox"
              checked={Boolean(formData.isPublished)}
              onChange={(event) => updateField("isPublished", event.target.checked)}
              className="h-4 w-4 accent-berry"
            />
            Hiển thị tin tức trên website
          </label>

          {apiError && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{apiError}</p>}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Lưu tin tức"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm outline-none focus:border-berry focus:bg-white";

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

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}
