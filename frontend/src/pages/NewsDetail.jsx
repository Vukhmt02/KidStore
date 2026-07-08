import { ArrowLeft, CalendarDays, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { newsService } from "../services/newsService";

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      try {
        setIsLoading(true);
        const data = await newsService.getBySlug(slug);
        if (!ignore) {
          setArticle(data);
          setError("");
        }
      } catch (error) {
        if (!ignore) setError(error.message || "Không thể tải tin tức");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadArticle();

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (isLoading) {
    return <div className="container-page py-16 text-sm font-bold text-cocoa/60">Đang tải tin tức...</div>;
  }

  if (error || !article) {
    return (
      <section className="container-page py-16">
        <p className="rounded-3xl bg-berry/10 px-5 py-4 text-sm font-bold text-berry">
          {error || "Không tìm thấy tin tức"}
        </p>
        <Link to="/news" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cocoa hover:text-berry">
          <ArrowLeft size={16} />
          Quay lại Tin tức
        </Link>
      </section>
    );
  }

  return (
    <article className="container-page py-10">
      <Link to="/news" className="inline-flex items-center gap-2 text-sm font-black text-cocoa/70 hover:text-berry">
        <ArrowLeft size={16} />
        Quay lại Tin tức
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="rounded-[2rem] border border-cocoa/10 bg-white p-6 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-bold text-cocoa/55">
            <CalendarDays size={16} />
            {formatDate(article.createdAt)}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-cocoa sm:text-5xl">{article.title}</h1>
          {article.summary && <p className="mt-5 text-base leading-8 text-cocoa/70">{article.summary}</p>}
        </div>

        {article.imageUrl && (
          <img src={article.imageUrl} alt={article.title} className="h-80 w-full rounded-[2rem] object-cover shadow-soft lg:h-[28rem]" />
        )}
      </div>

      {article.youtubeVideoId && (
        <section className="mt-10 overflow-hidden rounded-[2rem] border border-cocoa/10 bg-white shadow-soft">
          <div className="flex items-center gap-2 px-5 py-4 text-sm font-black text-cocoa">
            <PlayCircle size={18} className="text-berry" />
            Video liên quan
          </div>
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube.com/embed/${article.youtubeVideoId}`}
            title={article.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </section>
      )}

      {article.content && (
        <div className="prose prose-lg mt-10 max-w-none rounded-[2rem] border border-cocoa/10 bg-white p-6 text-cocoa shadow-sm">
          {article.content.split(/\n{2,}/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
    </article>
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
