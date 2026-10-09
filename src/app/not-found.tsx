import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[calc(100vh-226px)] items-center justify-center bg-[#f0f5f0] px-4 py-12">
            <div className="w-full max-w-[520px] text-center">
                <section className="rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] px-6 py-10 sm:px-10 sm:py-12">
                    {/* Illustration */}
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#edf5ed]">
                        <span className="text-5xl" aria-hidden="true">
                            🛒
                        </span>
                    </div>

                    {/* 404 */}
                    <p className="mt-6 text-7xl font-extrabold leading-none tracking-tight text-green-700">
                        404
                    </p>

                    <h1 className="mt-5 text-2xl font-bold text-[#263129] sm:text-3xl">
                        পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#68736a]">
                        দুঃখিত! আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি হয়তো সরানো হয়েছে, ঠিকানাটি
                        ভুল হয়েছে অথবা পৃষ্ঠাটি আর উপলব্ধ নেই।
                    </p>

                    {/* Actions */}
                    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-6 text-sm font-semibold text-white shadow-[0_3px_0_#065f46,0_5px_7px_rgba(0,0,0,0.12)] transition hover:bg-green-800 active:translate-y-0.5 active:shadow-none"
                        >
                            <span aria-hidden="true">⌂</span>
                            হোম পেজে ফিরে যান
                        </Link>

                        <Link
                            href="/#সব-পণ্য"
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#dce6dc] bg-[#fbfdfb] px-6 text-sm font-semibold text-[#263129] transition hover:border-green-700 hover:text-green-700"
                        >
                            পণ্য দেখুন
                        </Link>
                    </div>
                </section>

                <p className="mt-5 text-xs text-[#879188]">
                    বাজার দর · প্রয়োজনীয় পণ্যের দাম এক নজরে
                </p>
            </div>
        </main>
    );
}
