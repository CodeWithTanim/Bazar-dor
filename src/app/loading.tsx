export default function Loading() {
    return (
        <main className="min-h-screen animate-pulse bg-[#f0f5f0] px-4 py-6 sm:py-[30px]">
            <div className="mx-auto max-w-6xl space-y-7 sm:space-y-8">
                {/* Hero skeleton */}
                <section className="flex min-h-[289px] flex-col items-center justify-between gap-6 rounded-[26px] border border-[#dce7dc] bg-[#fbfdfb] px-5 py-6 sm:px-8 md:flex-row md:gap-8">
                    <div className="w-full space-y-4 md:flex-1">
                        <div className="h-7 w-44 rounded-full bg-[#e1eae1]" />

                        <div className="h-10 max-w-lg rounded-lg bg-[#e1eae1]" />

                        <div className="space-y-2">
                            <div className="h-4 max-w-xl rounded bg-[#e7eee7]" />
                            <div className="h-4 max-w-md rounded bg-[#e7eee7]" />
                        </div>

                        <div className="h-[42px] w-[122px] rounded-lg bg-[#d5e5d7]" />
                    </div>

                    <div className="flex w-full justify-center md:w-[280px] md:shrink-0">
                        <div className="h-[180px] w-[210px] rounded-2xl bg-[#e5ece5] sm:w-[240px]" />
                    </div>
                </section>

                {/* Product section skeleton */}
                <ProductSectionSkeleton count={6} titleWidth="w-40" />

                <ProductSectionSkeleton count={6} titleWidth="w-36" />

                <ProductSectionSkeleton count={36} titleWidth="w-24" subtitle />
            </div>
        </main>
    );
}

function ProductSectionSkeleton({
    count,
    titleWidth,
    subtitle = false,
}: {
    count: number;
    titleWidth: string;
    subtitle?: boolean;
}) {
    return (
        <section>
            {/* Section heading */}
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-3 rounded-sm bg-[#dce7dc]" />
                    <div className={`h-5 ${titleWidth} rounded bg-[#dce7dc]`} />
                </div>

                {subtitle && <div className="mt-2 h-3 w-48 rounded bg-[#e1eae1]" />}
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className="flex min-w-0 flex-col justify-between rounded-xl border border-[#e2eae2] bg-[#fbfdfb] p-3 sm:p-4"
                    >
                        {/* Product image and name */}
                        <div className="flex items-start gap-3">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-[#e8eee8]" />

                            <div className="min-w-0 flex-1 space-y-2 pt-1">
                                <div
                                    className={`h-3.5 rounded bg-[#e1eae1] ${index % 3 === 0
                                            ? "w-4/5"
                                            : index % 3 === 1
                                                ? "w-3/5"
                                                : "w-2/3"
                                        }`}
                                />
                                <div className="h-3 w-16 rounded bg-[#e7eee7]" />
                            </div>
                        </div>

                        {/* Price and change badge */}
                        <div className="mt-4 flex items-end justify-between gap-2">
                            <div className="space-y-1.5">
                                <div className="h-3 w-14 rounded bg-[#e7eee7]" />
                                <div className="h-4 w-20 rounded bg-[#dce7dc]" />
                            </div>

                            <div className="h-5 w-12 rounded-full bg-[#e8eee8]" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
