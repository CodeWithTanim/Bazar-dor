"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TProduct } from "@/type/Product";

const API_BASE = "https://api.api-store.workers.dev/api/bazardor";


const formatPrice = (value: number) =>
    new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
    }).format(value);

const formatAverage = (value: number) =>
    new Intl.NumberFormat("bn-BD", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(value);

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

export default function ProductDetailsPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;

    const [product, setProduct] = useState<TProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!slug) return;

        const controller = new AbortController();

        async function loadProduct() {
            setLoading(true);
            setError("");
            setProduct(null);

            try {
                // Fetch the product list and find the matching slug.
                const response = await fetch(`${API_BASE}/products`, {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
                }

                const data = await response.json();

                const products: TProduct[] = Array.isArray(data)
                    ? data
                    : Array.isArray(data.products)
                        ? data.products
                        : [];

                const found = products.find((item) => item.slug === slug);

                if (!found) {
                    setError("এই পণ্যটি খুঁজে পাওয়া যায়নি।");
                    return;
                }

                setProduct(found);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;

                console.error("[Product Details] Failed to load:", err);
                setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadProduct();

        return () => controller.abort();
    }, [slug]);

    const marketRows = useMemo(() => {
        if (!product) return [];

        return [...(product.markets || [])]
            .map((market) => ({
                ...market,
                average: (market.min + market.max) / 2,
            }))
            .sort((a, b) => a.average - b.average);
    }, [product]);

    const summary = useMemo(() => {
        if (!marketRows.length) return null;

        const min = Math.min(...marketRows.map((market) => market.min));
        const max = Math.max(...marketRows.map((market) => market.max));
        const average =
            marketRows.reduce((sum, market) => sum + market.average, 0) /
            marketRows.length;

        return { min, max, average };
    }, [marketRows]);

    const changeAmount = product ? product.today - product.yesterday : 0;

    const isUp = product?.change.dir === "up";
    const isDown = product?.change.dir === "down";

    const changeColor = isUp
        ? "text-red-600"
        : isDown
            ? "text-green-700"
            : "text-gray-500";

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 pb-12 pt-6">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mx-auto max-w-[1120px] animate-pulse">
                        <div className="mb-7 h-4 w-64 rounded bg-[#dfe7df]" />

                        <div className="h-[146px] rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb]" />

                        <div className="mt-5 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-4 sm:p-5">
                            <div className="mb-4 h-5 w-40 rounded bg-[#e1e9e1]" />

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-[86px] rounded-2xl border border-[#e1e9e1] bg-[#f0f5f0]"
                                    />
                                ))}
                            </div>

                            <div className="mb-4 mt-6 h-5 w-48 rounded bg-[#e1e9e1]" />

                            <div className="space-y-2">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="h-9 rounded-lg bg-[#e7ece7]" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 py-16">
                <div className="mx-auto max-w-[1120px] rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-5 py-12 text-center">
                    <p className="text-base font-medium text-[#263129]">
                        {error || "এই পণ্যটি খুঁজে পাওয়া যায়নি।"}
                    </p>

                    <Link
                        href="/"
                        className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 pb-12 pt-6">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mx-auto w-full max-w-[1120px]">
                    {/* Breadcrumb */}
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-7 flex flex-wrap items-center gap-2 text-xs text-[#68736a]"
                    >
                        <Link href="/" className="transition hover:text-green-700">
                            হোম
                        </Link>

                        <span>›</span>

                        <Link
                            href={`/category/${product.category}`}
                            className="transition hover:text-green-700"
                        >
                            {product.categoryNameBn}
                        </Link>

                        <span>›</span>

                        <span className="font-medium text-[#263129]">{product.nameBn}</span>
                    </nav>

                    {/* Product hero */}
                    <section className="flex min-h-[146px] items-center justify-between gap-4 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-4 sm:px-5 sm:py-4">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f0] text-[36px]">
                                {product.image || product.categoryIcon}
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-xl font-bold leading-7 text-[#263129] sm:text-2xl sm:leading-9">
                                    {product.nameBn}
                                </h1>

                                <p className="mt-0.5 text-xs text-[#68736a] sm:text-sm">
                                    প্রতি {getUnit(product.unit)} · {product.categoryNameBn}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-[#263129] sm:text-sm">
                                    {changeAmount === 0
                                        ? "গতকালের তুলনায় আজ দাম অপরিবর্তিত"
                                        : `গতকালের তুলনায় আজ দাম ${changeAmount > 0 ? "বেড়েছে" : "কমেছে"
                                        } ${formatPrice(Math.abs(changeAmount))} টাকা`}
                                </p>
                            </div>
                        </div>

                        <div className="flex min-w-[84px] shrink-0 flex-col items-center justify-center rounded-2xl bg-[#f0f5f0] px-3 py-3 sm:min-w-[98px] sm:px-4">
                            <p className="text-[11px] text-[#68736a] sm:text-xs">আজকের দাম</p>

                            <p className="mt-0.5 text-2xl font-bold leading-8 text-[#263129] sm:text-3xl">
                                {formatPrice(product.today)}
                            </p>

                            <p className="text-[11px] text-[#68736a] sm:text-xs">
                                টাকা / {getUnit(product.unit)}
                            </p>

                            <p className={`mt-1 text-xs font-bold ${changeColor}`}>
                                {isUp ? "▲" : isDown ? "▼" : "−"}{" "}
                                {formatPrice(product.change.pct)}%
                            </p>
                        </div>
                    </section>

                    {/* Price summary and market table */}
                    <section className="mt-5 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-4 sm:p-5">
                        <h2 className="text-base font-bold leading-6 text-[#263129]">
                            দামের সারসংক্ষেপ
                        </h2>

                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="flex min-h-[86px] flex-col justify-center rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-4 py-3">
                                <p className="text-xs text-[#68736a]">সর্বনিম্ন দাম</p>

                                <p className="mt-1 text-xl font-bold leading-6 text-green-700">
                                    {summary ? formatPrice(summary.min) : "N/A"}{" "}
                                    <span className="text-sm font-medium">টাকা</span>
                                </p>

                                <p className="mt-1 text-[11px] text-[#68736a]">
                                    সবচেয়ে কম দামের বাজার
                                </p>
                            </div>

                            <div className="flex min-h-[86px] flex-col justify-center rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-4 py-3">
                                <p className="text-xs text-[#68736a]">সর্বাধিক দাম</p>

                                <p className="mt-1 text-xl font-bold leading-6 text-red-600">
                                    {summary ? formatPrice(summary.max) : "N/A"}{" "}
                                    <span className="text-sm font-medium">টাকা</span>
                                </p>

                                <p className="mt-1 text-[11px] text-[#68736a]">
                                    সবচেয়ে বেশি দামের বাজার
                                </p>
                            </div>

                            <div className="flex min-h-[86px] flex-col justify-center rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-4 py-3">
                                <p className="text-xs text-[#68736a]">গড় দাম</p>

                                <p className="mt-1 text-xl font-bold leading-6 text-green-700">
                                    {summary ? formatAverage(summary.average) : "N/A"}{" "}
                                    <span className="text-sm font-medium">টাকা</span>
                                </p>

                                <p className="mt-1 text-[11px] text-[#68736a]">
                                    প্রতি {getUnit(product.unit)}-এর হিসাবে
                                </p>
                            </div>
                        </div>

                        <h2 className="mb-3 mt-6 text-base font-bold leading-6 text-[#263129]">
                            বাজারভিত্তিক আজকের দাম
                        </h2>

                        {marketRows.length > 0 ? (
                            <div className="overflow-hidden rounded-2xl border border-[#e1e9e1]">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[650px] border-collapse text-left text-xs sm:text-sm">
                                        <thead className="bg-[#fbfdfb] text-[#68736a]">
                                            <tr>
                                                <th className="px-3 py-3 font-semibold sm:px-4">
                                                    বাজার
                                                </th>
                                                <th className="px-3 py-3 font-semibold sm:px-4">
                                                    বিভাগ
                                                </th>
                                                <th className="px-3 py-3 text-right font-semibold sm:px-4">
                                                    সর্বনিম্ন
                                                </th>
                                                <th className="px-3 py-3 text-right font-semibold sm:px-4">
                                                    সর্বোচ্চ
                                                </th>
                                                <th className="px-3 py-3 text-right font-semibold sm:px-4">
                                                    গড়
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {marketRows.map((market, index) => (
                                                <tr
                                                    key={`${market.market}-${market.division}`}
                                                    className={`border-t border-[#dce4dc] ${index % 2 === 0 ? "bg-[#fbfdfb]" : "bg-[#f0f5f0]"
                                                        }`}
                                                >
                                                    <td className="whitespace-nowrap px-3 py-[11px] text-[#263129] sm:px-4">
                                                        {market.market}
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-[11px] text-[#263129] sm:px-4">
                                                        {market.division}
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-[11px] text-right text-[#263129] sm:px-4">
                                                        {formatPrice(market.min)} টাকা
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-[11px] text-right text-[#263129] sm:px-4">
                                                        {formatPrice(market.max)} টাকা
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-[11px] text-right font-semibold text-[#263129] sm:px-4">
                                                        {formatAverage(market.average)} টাকা
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-[#e1e9e1] bg-[#f0f5f0] px-4 py-8 text-center text-sm text-[#68736a]">
                                এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
