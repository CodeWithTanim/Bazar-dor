
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Slide, toast } from "react-toastify";

type SocialProvider = "google" | "github";

const toastOptions = {
    position: "bottom-right" as const,
    autoClose: 2500,
    theme: "light" as const,
    transition: Slide,
};

export default function SignUpPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<SocialProvider | "">("");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading || socialLoading) return;

        const formData = new FormData(e.currentTarget);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");
        const confirmPassword = String(formData.get("confirmPassword") || "");

        if (!name || !email || !password || !confirmPassword) {
            toast.error("সবগুলো ঘর পূরণ করুন", toastOptions);
            return;
        }

        if (password.length < 8) {
            toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে", toastOptions);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("দুটি পাসওয়ার্ড মিলছে না", toastOptions);
            return;
        }

        setLoading(true);
        console.log("[Signup] Email signup started:", { name, email });

        try {
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
                callbackURL: "/",
            });

            if (error) {
                console.error("[Signup] Failed:", error);
                toast.error(
                    error.message || "সাইন আপ করতে সমস্যা হয়েছে",
                    toastOptions
                );
                return;
            }

            console.log("[Signup] Signup request succeeded:", data);

            toast.success("অ্যাকাউন্ট তৈরি হয়েছে", toastOptions);
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("[Signup] Unexpected error:", error);
            toast.error("সাইন আপ করতে সমস্যা হয়েছে", toastOptions);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignUp = async (provider: SocialProvider) => {
        if (loading || socialLoading) return;

        setSocialLoading(provider);
        console.log(`[Signup] ${provider} OAuth started`);

        try {
            const { error } = await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });

            if (error) {
                console.error(`[Signup] ${provider} OAuth failed:`, error);

                toast.error(
                    error.message || "সোশ্যাল সাইন আপ করতে সমস্যা হয়েছে",
                    toastOptions
                );

                setSocialLoading("");
                return;
            }

            console.log(`[Signup] ${provider} OAuth redirect initiated`);
        } catch (error) {
            console.error(`[Signup] ${provider} error:`, error);
            toast.error("সোশ্যাল সাইন আপ করতে সমস্যা হয়েছে", toastOptions);
            setSocialLoading("");
        }
    };

    const isBusy = loading || Boolean(socialLoading);

    const inputClass =
        "h-9 w-full rounded-[7px] border border-[#e1e9e1] bg-transparent px-3 text-sm text-[#263129] outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-1 focus:ring-green-100 disabled:opacity-60";

    const labelClass =
        "mb-1 block text-sm font-medium text-[#263129]";


    return (
        <main className="flex min-h-[calc(100vh-226px)] items-start justify-center bg-[#f0f5f0] px-4 pb-16 pt-8">
            <div className="w-full max-w-[416px]">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold leading-8 tracking-tight text-[#263129]">
                        অ্যাকাউন্ট তৈরি করুন
                    </h1>

                    <p className="mt-1 text-sm leading-5 text-[#68736a]">
                        বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
                    </p>
                </div>

                <section className="rounded-2xl border border-[#e0e8e0] bg-[#fbfdfb] px-6 pb-6 pt-6">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-sm font-medium text-[#263129]"
                            >
                                নাম
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                placeholder="যেমন: রহিম উদ্দিন"
                                required
                                disabled={isBusy}
                                className="h-10 w-full rounded-lg border border-[#e1e9e1] bg-transparent px-3 text-sm text-[#263129] outline-none transition placeholder:text-[#737b74] focus:border-green-700 focus:ring-1 focus:ring-green-100 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-[#263129]"
                            >
                                ইমেইল
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                required
                                disabled={isBusy}
                                className="h-10 w-full rounded-lg border border-[#e1e9e1] bg-transparent px-3 text-sm text-[#263129] outline-none transition placeholder:text-[#737b74] focus:border-green-700 focus:ring-1 focus:ring-green-100 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-[#263129]"
                            >
                                পাসওয়ার্ড
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="কমপক্ষে ৮ অক্ষর"
                                minLength={8}
                                required
                                disabled={isBusy}
                                className="h-10 w-full rounded-lg border border-[#e1e9e1] bg-transparent px-3 text-sm text-[#263129] outline-none transition placeholder:text-[#737b74] focus:border-green-700 focus:ring-1 focus:ring-green-100 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1.5 block text-sm font-medium text-[#263129]"
                            >
                                পাসওয়ার্ড নিশ্চিত করুন
                            </label>

                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="আবার লিখুন"
                                minLength={8}
                                required
                                disabled={isBusy}
                                className="h-10 w-full rounded-lg border border-[#e1e9e1] bg-transparent px-3 text-sm text-[#263129] outline-none transition placeholder:text-[#737b74] focus:border-green-700 focus:ring-1 focus:ring-green-100 disabled:opacity-60"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isBusy}
                            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#07883f] px-4 text-sm font-semibold text-white shadow-[0_3px_0_#066b34,0_4px_6px_rgba(0,0,0,0.12)] transition hover:bg-[#067536] active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                                : "অ্যাকাউন্ট তৈরি করুন"}
                        </button>
                    </form>

                    <div className="my-4 flex items-center gap-4">
                        <div className="h-px flex-1 bg-[#e0e5e0]" />
                        <span className="shrink-0 text-xs text-[#657066]">অথবা</span>
                        <div className="h-px flex-1 bg-[#e0e5e0]" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleSocialSignUp("google")}
                            disabled={isBusy}
                            className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#e1e9e1] bg-transparent px-2 text-xs font-semibold text-[#263129] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt=""
                                aria-hidden="true"
                                width={15}
                                height={15}
                                className="shrink-0"
                            />

                            <span className="whitespace-nowrap">
                                {socialLoading === "google"
                                    ? "সংযোগ হচ্ছে..."
                                    : "Google দিয়ে চালিয়ে যান"}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialSignUp("github")}
                            disabled={isBusy}
                            className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#e1e9e1] bg-transparent px-2 text-xs font-semibold text-[#263129] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <img
                                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                                alt=""
                                aria-hidden="true"
                                width={15}
                                height={15}
                                className="shrink-0"
                            />

                            <span className="whitespace-nowrap">
                                {socialLoading === "github"
                                    ? "সংযোগ হচ্ছে..."
                                    : "GitHub দিয়ে চালিয়ে যান"}
                            </span>
                        </button>
                    </div>

                    <p className="mt-4 text-center text-sm text-[#657066]">
                        অ্যাকাউন্ট আছে?{" "}
                        <Link
                            href="/signin"
                            className="font-semibold text-[#07883f] hover:underline"
                        >
                            সাইন ইন করুন
                        </Link>
                    </p>
                </section>

                <div className="mt-5 text-center">
                    <Link
                        href="/"
                        className="text-sm text-[#7b857c] transition hover:text-green-700"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </main>
    );

}
