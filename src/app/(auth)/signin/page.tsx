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

export default function SignInPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | "">("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || socialLoading) return;

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন", toastOptions);
      return;
    }

    setLoading(true);
    console.log("[Signin] Email signin started:", { email });

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        console.error("[Signin] Failed:", error);
        toast.error(
          error.message || "সাইন ইন করতে সমস্যা হয়েছে",
          toastOptions,
        );
        return;
      }

      console.log("[Signin] Signin request succeeded:", data);

      toast.success("সফলভাবে সাইন ইন হয়েছে", toastOptions);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("[Signin] Unexpected error:", error);
      toast.error("সাইন ইন করতে সমস্যা হয়েছে", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    if (loading || socialLoading) return;

    setSocialLoading(provider);
    console.log(`[Signin] ${provider} OAuth started`);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        console.error(`[Signin] ${provider} OAuth failed:`, error);

        toast.error(
          error.message || "সোশ্যাল সাইন ইন করতে সমস্যা হয়েছে",
          toastOptions,
        );

        setSocialLoading("");
        return;
      }

      console.log(`[Signin] ${provider} OAuth redirect initiated`);
    } catch (error) {
      console.error(`[Signin] ${provider} error:`, error);
      toast.error("সোশ্যাল সাইন ইন করতে সমস্যা হয়েছে", toastOptions);
      setSocialLoading("");
    }
  };

  const isBusy = loading || Boolean(socialLoading);

  const inputClass =
    "h-10 w-full rounded-lg border border-[#e1e9e1] bg-transparent px-3 text-sm text-[#263129] outline-none transition placeholder:text-[#737b74] focus:border-green-700 focus:ring-1 focus:ring-green-100 disabled:opacity-60";

  const labelClass = "mb-1.5 block text-sm font-medium text-[#263129]";

  return (
    <main className="flex min-h-[calc(100vh-226px)] items-start justify-center bg-[#f0f5f0] px-4 pb-16 pt-8">
      <div className="w-full max-w-[416px]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold leading-8 tracking-tight text-[#263129]">
            সাইন ইন
          </h1>

          <p className="mt-1 text-sm leading-5 text-[#68736a]">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <section className="rounded-2xl border border-[#e0e8e0] bg-[#fbfdfb] px-6 pb-6 pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelClass}>
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
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="পাসওয়ার্ড লিখুন"
                required
                disabled={isBusy}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-[#07883f] px-4 text-sm font-semibold text-white shadow-[0_3px_0_#066b34,0_4px_6px_rgba(0,0,0,0.12)] transition hover:bg-[#067536] active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
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
              onClick={() => handleSocialSignIn("google")}
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
              onClick={() => handleSocialSignIn("github")}
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
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#07883f] hover:underline"
            >
              সাইন আপ করুন
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
