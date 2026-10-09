
import React from "react";

function ProductCardSkeleton() {
    return (
        <div className="min-h-[138px] animate-pulse rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-4">
            {/* Product name and image */}
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-[#e7ece7]" />

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-28 max-w-full rounded bg-[#e7ece7]" />
                    <div className="h-3 w-16 rounded bg-[#e7ece7]" />
                </div>
            </div>

            {/* Price and change badge */}
            <div className="mt-4 flex items-end justify-between gap-2">
                <div className="space-y-2">
                    <div className="h-3 w-16 rounded bg-[#e7ece7]" />
                    <div className="h-5 w-24 rounded bg-[#e7ece7]" />
                </div>

                <div className="mb-0.5 h-6 w-14 rounded-full bg-[#e7ece7]" />
            </div>
        </div>
    );
}

export default function CategoryLoading() {
    return (
        <main
            className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 pb-12 pt-5 sm:pt-6"
            aria-label="ক্যাটাগরির পণ্য লোড হচ্ছে"
        >
            <div className="mx-auto w-full max-w-7xl">
                <div className="mx-auto w-full max-w-[1120px]">
                    {/* Category heading skeleton */}
                    <section className="flex min-h-[94px] items-center gap-4 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-5 py-4">
                        <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-[#e7ece7]" />

                        <div className="flex-1 animate-pulse space-y-2">
                            <div className="h-7 w-24 rounded-md bg-[#e7ece7]" />
                            <div className="h-4 w-64 max-w-full rounded bg-[#e7ece7]" />
                        </div>
                    </section>

                    {/* Sorting skeleton */}
                    <section className="mt-6 flex min-h-[66px] animate-pulse items-center justify-end gap-3 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-4">
                        <div className="h-4 w-10 rounded bg-[#e7ece7]" />
                        <div className="h-9 w-[100px] rounded-lg border border-[#e1e9e1] bg-[#f0f5f0]" />
                    </section>

                    {/* Product count skeleton */}
                    <div className="mb-4 mt-4 h-5 w-44 animate-pulse rounded bg-[#e1e9e1]" />

                    {/* Product cards skeleton */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
