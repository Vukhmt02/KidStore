import { Edit, Palette, Plus, Ruler, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { catalogService } from "../../services/catalogService";

export default function AdminCatalogOptions() {
  const [activeTab, setActiveTab] = useState("sizes"); // "sizes" | "colors"
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  // Modal Size
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [sizeName, setSizeName] = useState("");

  // Modal Color
  const [showColorModal, setShowColorModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#3B82F6");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [sizeData, colorData] = await Promise.all([
        catalogService.getAdminSizes(),
        catalogService.getAdminColors()
      ]);
      setSizes(Array.isArray(sizeData) ? sizeData : []);
      setColors(Array.isArray(colorData) ? colorData : []);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu kích thước và màu sắc.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Xử lý Size ───────────────────────────────────────────
  const handleOpenSizeModal = (size = null) => {
    setEditingSize(size);
    setSizeName(size ? size.name : "");
    setActionError("");
    setShowSizeModal(true);
  };

  const handleSaveSize = async (e) => {
    e.preventDefault();
    if (!sizeName.trim()) {
      setActionError("Vui lòng nhập tên size.");
      return;
    }

    try {
      setIsSubmitting(true);
      setActionError("");
      if (editingSize) {
        await catalogService.updateSize(editingSize.id, { name: sizeName.trim() });
      } else {
        await catalogService.createSize({ name: sizeName.trim() });
      }
      setShowSizeModal(false);
      loadData();
    } catch (err) {
      setActionError(err.message || "Lỗi khi lưu kích thước.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSize = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa size "${name}"?`)) return;
    try {
      setActionError("");
      await catalogService.deleteSize(id);
      loadData();
    } catch (err) {
      setActionError(err.message || "Không thể xóa size.");
    }
  };

  // ── Xử lý Color ──────────────────────────────────────────
  const handleOpenColorModal = (color = null) => {
    setEditingColor(color);
    setColorName(color ? color.name : "");
    setColorHex(color?.hexCode || "#3B82F6");
    setActionError("");
    setShowColorModal(true);
  };

  const handleSaveColor = async (e) => {
    e.preventDefault();
    if (!colorName.trim()) {
      setActionError("Vui lòng nhập tên màu.");
      return;
    }

    try {
      setIsSubmitting(true);
      setActionError("");
      if (editingColor) {
        await catalogService.updateColor(editingColor.id, {
          name: colorName.trim(),
          hexCode: colorHex
        });
      } else {
        await catalogService.createColor({
          name: colorName.trim(),
          hexCode: colorHex
        });
      }
      setShowColorModal(false);
      loadData();
    } catch (err) {
      setActionError(err.message || "Lỗi khi lưu màu sắc.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteColor = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa màu "${name}"?`)) return;
    try {
      setActionError("");
      await catalogService.deleteColor(id);
      loadData();
    } catch (err) {
      setActionError(err.message || "Không thể xóa màu sắc.");
    }
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-cocoa sm:text-3xl">Size & Màu sắc</h2>
          <p className="mt-2 text-sm text-cocoa/60">
            Quản lý các biến thể kích thước và màu sắc áp dụng cho sản phẩm KidStore.
          </p>
        </div>

        <Button onClick={() => (activeTab === "sizes" ? handleOpenSizeModal() : handleOpenColorModal())}>
          <Plus size={18} />
          {activeTab === "sizes" ? "Thêm Size mới" : "Thêm Màu mới"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cocoa/10">
        <button
          type="button"
          onClick={() => {
            setActiveTab("sizes");
            setActionError("");
          }}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition ${
            activeTab === "sizes"
              ? "border-berry text-berry"
              : "border-transparent text-cocoa/60 hover:text-cocoa"
          }`}
        >
          <Ruler size={18} />
          <span>Kích thước ({sizes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("colors");
            setActionError("");
          }}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition ${
            activeTab === "colors"
              ? "border-berry text-berry"
              : "border-transparent text-cocoa/60 hover:text-cocoa"
          }`}
        >
          <Palette size={18} />
          <span>Màu sắc ({colors.length})</span>
        </button>
      </div>

      {error && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{error}</p>}
      {actionError && (
        <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{actionError}</p>
      )}

      {/* Content */}
      {isLoading ? (
        <p className="text-center py-10 text-sm text-cocoa/50">Đang tải danh sách...</p>
      ) : activeTab === "sizes" ? (
        /* DANH SÁCH SIZE */
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sizes.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-2xl border border-cocoa/10 bg-white p-4 shadow-sm"
            >
              <div>
                <span className="inline-block rounded-xl bg-peach px-3 py-1 font-black text-cocoa text-sm">
                  {s.name}
                </span>
                <p className="mt-1.5 text-xs text-cocoa/50">
                  {s.productCount ? `${s.productCount} sản phẩm dùng` : "Chưa có sản phẩm"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenSizeModal(s)}
                  className="rounded-xl p-2 text-cocoa hover:bg-cream hover:text-berry"
                  title="Sửa size"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSize(s.id, s.name)}
                  className="rounded-xl p-2 text-cocoa hover:bg-cream hover:text-red-500"
                  title="Xóa size"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {sizes.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-cocoa/50">Chưa có size nào.</p>
          )}
        </div>
      ) : (
        /* DANH SÁCH MÀU */
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {colors.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl border border-cocoa/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-8 w-8 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: c.hexCode || "#ccc" }}
                />
                <div>
                  <p className="text-sm font-bold text-cocoa">{c.name}</p>
                  <p className="text-xs text-cocoa/40">{c.hexCode || "Mặc định"}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenColorModal(c)}
                  className="rounded-xl p-2 text-cocoa hover:bg-cream hover:text-berry"
                  title="Sửa màu"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteColor(c.id, c.name)}
                  className="rounded-xl p-2 text-cocoa hover:bg-cream hover:text-red-500"
                  title="Xóa màu"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {colors.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-cocoa/50">Chưa có màu nào.</p>
          )}
        </div>
      )}

      {/* Modal Size */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/40 px-4">
          <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-cocoa">
                {editingSize ? "Chỉnh sửa Size" : "Thêm Size mới"}
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="rounded-full bg-cream p-2 text-cocoa hover:text-berry"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSize} className="mt-5 grid gap-4">
              <div>
                <label className="block text-xs font-bold text-cocoa mb-1.5">Tên kích thước</label>
                <input
                  type="text"
                  value={sizeName}
                  onChange={(e) => setSizeName(e.target.value)}
                  placeholder="Ví dụ: 1Y, 2Y, 3Y, 110, S, M..."
                  className="w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm text-cocoa outline-none focus:border-berry focus:bg-white"
                  required
                />
              </div>

              {actionError && (
                <p className="rounded-xl bg-berry/10 px-3 py-2 text-xs font-semibold text-berry">
                  {actionError}
                </p>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="secondary" onClick={() => setShowSizeModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Color */}
      {showColorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/40 px-4">
          <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-cocoa">
                {editingColor ? "Chỉnh sửa Màu sắc" : "Thêm Màu mới"}
              </h3>
              <button
                type="button"
                onClick={() => setShowColorModal(false)}
                className="rounded-full bg-cream p-2 text-cocoa hover:text-berry"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveColor} className="mt-5 grid gap-4">
              <div>
                <label className="block text-xs font-bold text-cocoa mb-1.5">Tên màu</label>
                <input
                  type="text"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="Ví dụ: Hồng phấn, Xanh dương, Vàng chanh..."
                  className="w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm text-cocoa outline-none focus:border-berry focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cocoa mb-1.5">Mã màu (Hex Code)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="h-11 w-14 cursor-pointer rounded-xl border border-cocoa/10 bg-transparent p-1"
                  />
                  <input
                    type="text"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="flex-1 rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 text-sm font-mono text-cocoa outline-none focus:border-berry focus:bg-white"
                  />
                </div>
              </div>

              {actionError && (
                <p className="rounded-xl bg-berry/10 px-3 py-2 text-xs font-semibold text-berry">
                  {actionError}
                </p>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="secondary" onClick={() => setShowColorModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
