import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "./Button";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-berry shadow-sm">
              {product.badge}
            </span>
          )}
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-cocoa shadow-sm transition hover:text-berry"
            aria-label="Yêu thích"
          >
            <Heart size={18} />
          </button>
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 min-h-12 text-base font-bold text-cocoa transition hover:text-berry">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-lg font-extrabold text-berry">{formatCurrency(product.price)}</p>
          <Button size="sm" onClick={() => addToCart(product)} aria-label="Thêm vào giỏ">
            <ShoppingBag size={16} />
          </Button>
        </div>
      </div>
    </article>
  );
}
