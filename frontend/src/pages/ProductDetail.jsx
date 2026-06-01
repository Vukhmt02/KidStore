import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import { getProductById, products } from "../data/products";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] || "");
  const [color, setColor] = useState(product?.colors[0] || "");
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(
    () => products.filter((item) => item.category === product?.category && item.id !== product?.id).slice(0, 4),
    [product]
  );

  if (!product) {
    return (
      <section className="container-page py-12">
        <EmptyState
          title="Sản phẩm không tồn tại"
          description="Sản phẩm có thể đã được gỡ hoặc đường dẫn chưa chính xác."
          actionLabel="Quay lại sản phẩm"
          onAction={() => navigate("/products")}
        />
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-[96px_1fr]">
          <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            {product.gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setImageIndex(index)}
                className={`aspect-square w-20 overflow-hidden rounded-2xl border-2 bg-white sm:w-full ${
                  imageIndex === index ? "border-berry" : "border-transparent"
                }`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 overflow-hidden rounded-[2rem] bg-white shadow-soft sm:order-2">
            <img src={product.gallery[imageIndex]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-cocoa/10 bg-white p-6 shadow-sm sm:p-8">
          <Link to="/products" className="text-sm font-bold text-berry hover:text-cocoa">
            Quay lại sản phẩm
          </Link>
          <h1 className="mt-4 text-3xl font-black tracking-normal text-cocoa sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-2xl font-black text-berry">{formatCurrency(product.price)}</p>
          <p className="mt-5 leading-7 text-cocoa/75">{product.description}</p>

          <div className="mt-7">
            <h2 className="text-sm font-bold text-cocoa">Chọn size</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSize(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    size === item ? "border-berry bg-peach text-cocoa" : "border-cocoa/10 hover:border-berry"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <h2 className="text-sm font-bold text-cocoa">Chọn màu</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                    color === item ? "border-berry bg-peach text-cocoa" : "border-cocoa/10 hover:border-berry"
                  }`}
                >
                  {color === item && <Check size={15} />}
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-full border border-cocoa/10 bg-cream">
              <button type="button" className="px-4" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                <Minus size={16} />
              </button>
              <span className="min-w-8 text-center font-bold">{quantity}</span>
              <button type="button" className="px-4" onClick={() => setQuantity((value) => value + 1)}>
                <Plus size={16} />
              </button>
            </div>
            <Button size="lg" onClick={() => addToCart(product, { size, color, quantity })}>
              <ShoppingBag size={18} />
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="section-title">Sản phẩm liên quan</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
