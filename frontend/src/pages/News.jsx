import { ArrowRight, CalendarDays, Newspaper, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { newsService } from "../services/newsService";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadNews() {
      try {
        setIsLoading(true);
        const data = await newsService.getPublished();
        if (!ignore) {
          setArticles(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (error) {
        if (!ignore) setError(error.message || "Không thể tải tin tức từ máy chủ");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadNews();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-cocoa shadow-sm">
            <Newspaper size={16} className="text-berry" />
            Tin tức KidStore
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-normal text-cocoa sm:text-5xl">
            Tin mới về sản phẩm và cách chăm sóc đồ cho bé
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-cocoa/70">
            Cập nhật bộ sưu tập mới, mẹo chọn size, gợi ý phối đồ và video từ KidStore.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=85"
          alt="Tin tức thời trang trẻ em"
          className="h-72 w-full rounded-[2rem] object-cover shadow-soft sm:h-96"
        />
      </div>

      {error && <p className="mt-8 rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{error}</p>}
      {isLoading && <p className="mt-8 text-sm font-semibold text-cocoa/55">Đang tải tin tức...</p>}

      {!isLoading && !error && articles.length === 0 && (
        <div className="mt-10 rounded-[2rem] border border-dashed border-cocoa/15 bg-white p-8 text-center">
          <p className="text-lg font-black text-cocoa">Chưa có tin tức nào được đăng.</p>
          <p className="mt-2 text-sm text-cocoa/60">Admin có thể thêm bài viết trong trang quản trị.</p>
        </div>
      )}

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {articles.map((article) => (
          <article key={article.id} className="overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <div className="relative">
              <img
                src={article.imageUrl || "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85"}
                alt={article.title}
                className="aspect-[4/3] w-full object-cover"
              />
              {article.youtubeVideoId && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-cocoa shadow-sm">
                  <PlayCircle size={14} className="text-berry" />
                  Video
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="flex items-center gap-2 text-xs font-bold text-cocoa/55">
                <CalendarDays size={14} />
                {formatDate(article.createdAt)}
              </p>
              <h2 className="mt-3 line-clamp-2 min-h-14 text-lg font-black text-cocoa">{article.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-cocoa/65">{article.summary || "Xem chi tiết bài viết tại KidStore."}</p>
              <Link to={`/news/${article.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-berry hover:text-cocoa">
                Đọc tiếp
                <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
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
