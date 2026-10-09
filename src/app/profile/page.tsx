"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Slide, toast } from "react-toastify";

const toastOptions = {
    position: "bottom-right" as const,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light" as const,
    transition: Slide,
};

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;

    const [name, setName] = useState("");
    const [updating, setUpdating] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
        }
    }, [user?.name]);

    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/signin");
        }
    }, [isPending, user, router]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user || updating) return;

        const updatedName = name.trim();

        if (!updatedName) {
            toast.error("নাম লিখুন", toastOptions);
            return;
        }

        if (updatedName === user.name) {
            toast.info("নামে কোনো পরিবর্তন করা হয়নি", toastOptions);
            return;
        }

        setUpdating(true);
        console.log("[Profile] Updating user name:", updatedName);

        try {
            const { data, error } = await authClient.updateUser({
                name: updatedName,
            });

            if (error) {
                console.error("[Profile] Update failed:", error);
                toast.error(
                    error.message || "প্রোফাইল আপডেট করা যায়নি",
                    toastOptions
                );
                return;
            }

            console.log("[Profile] Update successful:", data);

            toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে", toastOptions);
            router.refresh();
        } catch (error) {
            console.error("[Profile] Unexpected error:", error);
            toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে", toastOptions);
        } finally {
            setUpdating(false);
        }
    };

    const handleSignOut = async () => {
        if (signingOut) return;

        setSigningOut(true);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                console.error("[Profile] Sign out failed:", error);
                toast.error("সাইন আউট করতে সমস্যা হয়েছে", toastOptions);
                return;
            }

            toast.success("সফলভাবে সাইন আউট হয়েছে", toastOptions);
            window.location.href = "/";
        } catch (error) {
            console.error("[Profile] Unexpected sign out error:", error);
            toast.error("সাইন আউট করতে সমস্যা হয়েছে", toastOptions);
        } finally {
            setSigningOut(false);
        }
    };

    if (isPending || !user) {
        return (
            <main className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 py-10">
                <div className="mx-auto max-w-[555px] animate-pulse">
                    <div className="mx-auto mb-5 h-[76px] w-[76px] rounded-lg bg-gray-200" />
                    <div className="mb-2 h-7 w-40 rounded bg-gray-200" />
                    <div className="mb-6 h-4 w-52 rounded bg-gray-200" />
                    <div className="mb-4 h-[90px] rounded-xl bg-gray-200" />
                    <div className="h-[190px] rounded-xl bg-gray-200" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 pb-12 pt-6 sm:pt-8">
            <div className="mx-auto w-full max-w-[555px]">
                <div className="mb-5 flex justify-center">
                    <div className="relative h-[76px] w-[76px] overflow-hidden rounded-lg bg-[#d9d9d9]">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name || "Profile"}
                                fill
                                sizes="76px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-gray-500">
                                {(user.name || user.email || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <h1 className="text-xl font-bold leading-7 text-[#263129]">
                        আমার প্রোফাইল
                    </h1>

                    <p className="mt-0.5 text-xs leading-5 text-[#68736a]">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
                    </p>
                </div>

                <section className="mb-[18px] flex min-h-[91px] items-center justify-between gap-3 rounded-xl border border-[#e0e8e0] bg-[#fbfdfb] px-4 py-4 sm:px-[18px]">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-[54px] w-[60px] shrink-0 overflow-hidden rounded-xl bg-gray-200">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || "Profile"}
                                    fill
                                    sizes="60px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-500">
                                    {(user.name || user.email || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold text-[#263129] sm:text-base">
                                {user.name || "ব্যবহারকারী"}
                            </h2>

                            <p className="truncate text-xs leading-5 text-[#68736a] sm:text-sm">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-red-400 px-2.5 py-2 text-[11px] font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 sm:px-3 sm:text-xs"
                    >
                        <span aria-hidden="true">↪</span>
                        {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                    </button>
                </section>

                <section className="rounded-xl border border-[#e0e8e0] bg-[#fbfdfb] px-4 py-5 sm:px-[15px] sm:py-[18px]">
                    <h2 className="text-sm font-bold text-[#263129]">তথ্য</h2>

                    <form
                        onSubmit={handleUpdate}
                        className="mt-7 px-1.5 pb-3"
                    >
                        <label
                            htmlFor="profile-name"
                            className="mb-1.5 block text-xs font-medium text-[#263129]"
                        >
                            নাম
                        </label>

                        <input
                            id="profile-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="আপনার নাম লিখুন"
                            required
                            disabled={updating}
                            className="h-[31px] w-full rounded-[7px] border border-[#e1e9e1] bg-transparent px-3 text-xs text-[#263129] outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-1 focus:ring-green-100 disabled:opacity-60"
                        />

                        <button
                            type="submit"
                            disabled={updating || !name.trim()}
                            className="mt-3 flex h-[32px] w-full items-center justify-center rounded-[7px] bg-[#07883f] px-4 text-xs font-semibold text-white shadow-[0_3px_0_#066b34,0_4px_6px_rgba(0,0,0,0.12)] transition hover:bg-[#067536] active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
