"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TCategory } from "@/type/category";
import { TProduct } from "@/type/Product";

const API_BASE = "https://api.api-store.workers.dev/api/bazardor";


type SortOption = "default" | "price-asc" | "price-desc";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

const parseBengaliNumber = (value: number | string): number => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const bnDigits: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  const normalized = String(value).replace(/[০-৯]/g, (d) => bnDigits[d] || d);
  const parsed = parseFloat(normalized.replace(/[^0-9.-]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
};

const getUnit = (unit: string) => {
  const units: Record<string, string> = {
    kg: "কেজি",
    g: "গ্রাম",
    litre: "লিটার",
    liter: "লিটার",
    ml: "মিলিলিটার",
    piece: "টি",
    pcs: "টি",
    dozen: "ডজন",
  };

  return units[unit.toLowerCase()] || unit;
};

const categoryFallback: Record<string, TCategory> = {
  chal: { slug: "chal", nameBn: "চাল", icon: "🍚" },
  dal: { slug: "dal", nameBn: "ডাল", icon: "🫘" },
  tel: { slug: "tel", nameBn: "তেল", icon: "🛢️" },
  sobji: { slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  mach: { slug: "mach", nameBn: "মাছ", icon: "🐟" },
  mangsho: { slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  dudh: { slug: "dudh", nameBn: "দুধ", icon: "🥛" },
  moshla: { slug: "moshla", nameBn: "মসলা", icon: "🌶️" },
};

function ProductCard({ product }: { product: TProduct }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const badgeClass = isUp
    ? "bg-[#fcefee] text-red-600"
    : isDown
      ? "bg-[#edf7ef] text-green-700"
      : "bg-[#eff3ef] text-[#263129]";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex min-h-[138px] flex-col justify-between rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-4 transition-colors hover:border-[#b9d7c0]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
          {product.image || product.categoryIcon}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold leading-5 text-[#263129] group-hover:text-green-800">
            {product.nameBn}
          </h2>

          <p className="mt-0.5 text-xs leading-4 text-[#68736a]">
            প্রতি {getUnit(product.unit)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs leading-4 text-[#68736a]">
            আজকের দাম
          </p>

          <p className="mt-0.5 text-lg font-bold leading-6 text-[#263129]">
            {formatNumber(product.today)} টাকা
          </p>
        </div>

        <span
          className={`mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold leading-none ${badgeClass}`}
        >
          <span>
            {isUp ? "▲" : isDown ? "▼" : "−"}
          </span>
          {formatNumber(product.change.pct)}%
        </span>
      </div>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="min-h-[138px] animate-pulse rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-200" />

        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-5 w-20 rounded bg-gray-200" />
        </div>

        <div className="h-6 w-14 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [products, setProducts] = useState<TProduct[]>([]);
  const [category, setCategory] = useState<TCategory | null>(null);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function loadCategory() {
      setLoading(true);
      setError("");
      setProducts([]);
      setSort("default");

      const fallback = categoryFallback[slug] || {
        slug,
        nameBn: slug,
        icon: "🛒",
      };

      setCategory(fallback);

      try {
        const [productsResponse, categoryResponse] = await Promise.all([
          fetch(
            `${API_BASE}/products?category=${encodeURIComponent(slug)}`,
            {
              signal: controller.signal,
              cache: "no-store",
            }
          ),
          fetch(`${API_BASE}/categories/${encodeURIComponent(slug)}`, {
            signal: controller.signal,
            cache: "no-store",
          }).catch(() => null),
        ]);

        if (!productsResponse.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি");
        }

        const productData = await productsResponse.json();

        const productList: TProduct[] = Array.isArray(productData)
          ? productData
          : Array.isArray(productData.products)
            ? productData.products
            : [];

        if (categoryResponse?.ok) {
          const categoryData = await categoryResponse.json();

          const info = Array.isArray(categoryData)
            ? categoryData[0]
            : categoryData.category || categoryData;

          if (info) {
            setCategory({
              slug: info.slug || slug,
              nameBn:
                info.nameBn ||
                productList[0]?.categoryNameBn ||
                fallback.nameBn,
              icon:
                info.icon ||
                info.categoryIcon ||
                productList[0]?.categoryIcon ||
                fallback.icon,
            });
          }
        } else if (productList.length > 0) {
          setCategory({
            slug,
            nameBn: productList[0].categoryNameBn,
            icon: productList[0].categoryIcon,
          });
        }

        setProducts(productList);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("[Category] Failed to load products:", err);
        setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => controller.abort();
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "price-asc") {
      result.sort((a, b) => parseBengaliNumber(a.today) - parseBengaliNumber(b.today));
    }

    if (sort === "price-desc") {
      result.sort((a, b) => parseBengaliNumber(b.today) - parseBengaliNumber(a.today));
    }

    return result;
  }, [products, sort]);

  return (
    <main className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 pb-12 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto w-full max-w-[1120px]">
          <section className="flex min-h-[94px] items-center gap-4 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-5 py-4">
            <span className="text-[36px] leading-none">
              {category?.icon || "🛒"}
            </span>

            <div>
              <h1 className="text-2xl font-bold leading-8 text-[#263129]">
                {category?.nameBn || "ক্যাটাগরি"}
              </h1>

              <p className="mt-1 text-sm leading-5 text-[#68736a]">
                {loading
                  ? "পণ্যের তথ্য লোড হচ্ছে..."
                  : `${formatNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}
              </p>
            </div>
          </section>

          <section className="mt-6 flex min-h-[66px] items-center justify-end gap-3 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-4">
            <label
              htmlFor="category-sort"
              className="text-sm text-[#68736a]"
            >
              সাজান
            </label>

            <div className="relative inline-flex items-center">
              <select
                id="category-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                disabled={loading || products.length === 0}
                className="h-9 appearance-none rounded-lg border border-[#d7dfd7] bg-transparent pl-3 pr-8 text-sm text-[#263129] outline-none focus:border-green-700 disabled:opacity-60 cursor-pointer"
              >
                <option value="default">ডিফল্ট</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
              </select>

              <svg
                className="pointer-events-none absolute right-2.5 h-3 w-3 text-gray-500"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m3 4.5 3 3 3-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </section>

          <p className="mb-4 mt-4 text-sm leading-5 text-[#68736a]">
            {loading
              ? "পণ্যের তথ্য লোড হচ্ছে..."
              : `মোট ${formatNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে`}
          </p>

          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-6 py-12 text-center">
              <p className="text-base text-red-600">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          )}

          {!loading && !error && sortedProducts.length === 0 && (
            <div className="rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-6 py-12 text-center">
              <p className="text-4xl">{category?.icon || "🛒"}</p>

              <h2 className="mt-4 text-lg font-semibold text-[#263129]">
                এই ক্যাটাগরিতে কোনো পণ্য নেই
              </h2>

              <p className="mt-2 text-sm text-[#68736a]">
                অন্য ক্যাটাগরির পণ্য দেখতে হোম পেজে ফিরে যান।
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          )}

          {!loading && !error && sortedProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
