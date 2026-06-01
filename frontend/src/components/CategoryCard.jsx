import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className={`group overflow-hidden rounded-[1.75rem] ${category.color} p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft`}
    >
      <div className="aspect-[5/4] overflow-hidden rounded-[1.35rem] bg-white/50">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between px-2 py-4">
        <h3 className="text-lg font-bold text-cocoa">{category.name}</h3>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-cocoa">Xem ngay</span>
      </div>
    </Link>
  );
}
