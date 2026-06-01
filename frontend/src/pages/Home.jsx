import Banner from "../components/Banner";
import CategoryCard from "../components/CategoryCard";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";

export default function Home() {
  const newProducts = products.slice(0, 4);
  const bestSellers = products.filter((product) => product.badge === "Bán chạy" || product.badge === "Hot").slice(0, 4);

  return (
    <>
      <HeroSection />

      <section className="container-page py-10">
        <div className="mb-7">
          <h2 className="section-title">Danh mục nổi bật</h2>
          <p className="section-subtitle">Chọn nhanh theo độ tuổi và phong cách bé thích.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title">Sản phẩm mới</h2>
            <p className="section-subtitle">Những thiết kế vừa cập bến KidStore.</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Banner />

      <section className="container-page py-10">
        <div className="mb-7">
          <h2 className="section-title">Sản phẩm bán chạy</h2>
          <p className="section-subtitle">Các món được phụ huynh chọn nhiều trong tuần.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
