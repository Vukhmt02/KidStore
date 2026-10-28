import { Heart, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product);
    } catch (error) {
      if (error.message === "LOGIN_REQUIRED" || error.status === 401) {
        navigate("/login", { state: { message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng." } });
        return;
      }
      navigate(`/products/${product.id}`);
    }
  };

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const oldPrice = hasDiscount ? product.price : null;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : null;

  return (
    <article className="group flex flex-col justify-between">
      <Link to={`/products/${product.id}`} className="block overflow-hidden bg-gray-50 rounded-sm">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
          />
          {discountPercent && (
            <span className="absolute left-2 top-2 rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.badge && !discountPercent && (
            <span className="absolute left-2 top-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              {product.badge}
            </span>
          )}
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow transition hover:bg-red-600 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
            title="Thêm vào giỏ"
            aria-label="Thêm vào giỏ"
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </Link>

      <div className="mt-2.5 flex flex-1 flex-col justify-between">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 min-h-[38px] text-[13px] sm:text-sm font-normal text-gray-800 transition hover:text-red-600 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-red-600">
              {formatCurrency(currentPrice)}
            </span>
            {oldPrice && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(oldPrice)}
                </span>
                <span className="text-xs font-bold text-red-600">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>
          {oldPrice && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              Giá cũ: {formatCurrency(oldPrice)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
