import { ArrowRight, HeartHandshake, PackageCheck, Shirt, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import CategoryCard from "../components/CategoryCard";
import HeroSection from "../components/HeroSection";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../hooks/useCatalog";

export default function Home() {
  const { categories, products, isLoading, error } = useCatalog();
  const newProducts = products.slice(0, 4);
  const bestSellers = getBestSellers(products);

  if (isLoading) return <Loading />;

  return (
    <>
      <HeroSection />

      {error && <p className="container-page mt-8 text-sm font-semibold text-berry">{error}</p>}

      <section className="container-page py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <TrustItem icon={Shirt} title="Form de mac" text="Thiet ke thoai mai cho be van dong moi ngay." />
          <TrustItem icon={PackageCheck} title="Goi hang can than" text="Dong goi gon dep, san sang lam qua tang." />
          <TrustItem icon={HeartHandshake} title="Ho tro doi size" text="Tu van size va doi tra nhanh khi can." />
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeader
          eyebrow="Mua sam theo nhu cau"
          title="Danh muc noi bat"
          text="Chon nhanh nhom san pham phu hop voi do tuoi va phong cach cua be."
          actionLabel="Xem tat ca"
          actionHref="/products"
        />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeader
          eyebrow="Vua len ke"
          title="San pham moi"
          text="Cac mau moi duoc cap nhat tu catalog KidStore."
          actionLabel="Di toi cua hang"
          actionHref="/products"
        />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Banner />

      <section className="container-page py-10">
        <SectionHeader
          eyebrow="Duoc yeu thich"
          title="San pham ban chay"
          text="Nhung mon hang phu huynh thuong chon khi mua cho be."
          actionLabel="Xem them"
          actionHref="/products"
        />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

function getBestSellers(products) {
  const taggedProducts = products
    .filter((product) => product.badge === "Ban chay" || product.badge === "Hot" || product.badge === "Bán chạy")
    .slice(0, 4);

  return taggedProducts.length ? taggedProducts : products.slice(0, 4);
}

function SectionHeader({ eyebrow, title, text, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-berry">{eyebrow}</p>
        <h2 className="section-title mt-2">{title}</h2>
        <p className="section-subtitle">{text}</p>
      </div>
      <Link
        to={actionHref}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-cocoa/10 bg-white px-4 py-2 text-sm font-bold text-cocoa transition hover:border-berry hover:text-berry"
      >
        {actionLabel}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function TrustItem({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-cocoa/10 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-peach text-cocoa">
        <Icon size={20} />
      </div>
      <div>
        <div className="flex items-center gap-1">
          <h3 className="font-black text-cocoa">{title}</h3>
          <Star size={14} className="fill-berry text-berry" />
        </div>
        <p className="mt-1 text-sm leading-6 text-cocoa/65">{text}</p>
      </div>
    </div>
  );
}
