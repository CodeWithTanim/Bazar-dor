import Image from "next/image";
import Link from "next/link";
import heroImage from "../../public/bazar-hero.png";
import { TProduct } from "@/type/Product";


const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

const getUnit = (unit: string) => {
  const units: Record<string, string> = {
    kg: "কেজি",
    g: "গ্রাম",
    liter: "লিটার",
    litre: "লিটার",
    ml: "মিলিলিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
  };

  return units[unit.toLowerCase()] || unit;
};

const ProductCard = ({ product }: { product: TProduct }) => {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex min-w-0 flex-col justify-between rounded-xl border border-[#e2eae2] bg-[#fbfdfb] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm sm:p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
          {product.image || product.categoryIcon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-[#263129] group-hover:text-green-800">
            {product.nameBn}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            প্রতি {getUnit(product.unit)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-[11px] text-gray-500">আজকের দাম</p>

          <p className="mt-0.5 text-base font-bold text-[#263129]">
            {formatNumber(product.today)} টাকা
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "—"}
          {formatNumber(product.change.pct)}%
        </span>
      </div>
    </Link>
  );
};

const ProductSection = ({
  title,
  products,
  type,
  subtitle,
}: {
  title: string;
  products: TProduct[];
  type: "up" | "down" | "all";
  subtitle?: string;
}) => {
  return (
    <section
      id={type === "all" ? "সব-পণ্য" : undefined}
      className="scroll-mt-6"
    >
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#263129]">
          {type !== "all" && (
            <span className={type === "up" ? "text-red-600" : "text-green-700"}>
              {type === "up" ? "▲" : "▼"}
            </span>
          )}
          {title}
        </h2>

        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
          এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
};

export default async function Home() {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  const res = await fetch(API_URL, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: TProduct[] = await res.json();

  const products = data;

  const risers = [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-6 sm:py-[30px]">
      <div className="mx-auto max-w-6xl space-y-7 sm:space-y-8">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-between gap-6 rounded-[26px] border border-[#dce7dc] bg-[#fbfdfb] px-5 py-6 sm:px-8 md:min-h-[289px] md:flex-row md:gap-8">
          <div className="w-full md:flex-1">
            <span className="inline-flex rounded-full bg-[#e1f1e7] px-3 py-1 text-sm font-medium text-green-700">
              {date}
            </span>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1c2920] sm:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#6b756d] sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম, বাজারভিত্তিক
              বিশ্লেষণ, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <a
              href="#সব-পণ্য"
              className="mt-7 inline-flex h-[42px] items-center justify-center rounded-lg bg-green-700 px-6 text-sm font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.2)] transition-colors hover:bg-green-800"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <div className="flex w-full items-center justify-center md:w-[280px] md:shrink-0">
            <Image
              src={heroImage}
              alt="বাজারের তাজা পণ্য"
              priority
              className="h-auto w-[210px] object-contain sm:w-[240px] md:w-[250px]"
            />
          </div>
        </section>

        {/* Today's Price Rises */}
        <ProductSection title="আজ দাম বেড়েছে" products={risers} type="up" />

        {/* Today's Price Falls */}
        <ProductSection title="আজ দাম কমেছে" products={fallers} type="down" />

        {/* All Products */}
        <ProductSection
          title="সব পণ্য"
          subtitle={`${formatNumber(products.length)}টি পণ্যের সর্বশেষ বাজারদর`}
          products={products}
          type="all"
        />
      </div>
    </main>
  );
}
