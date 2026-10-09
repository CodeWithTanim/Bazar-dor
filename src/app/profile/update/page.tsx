"use client";

import React, { useState } from "react";
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

function UpdateForm({
    initialName,
    userImage,
    userEmail,
}: {
    initialName: string;
    userImage?: string | null;
    userEmail: string;
}) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (updating) return;

        const updatedName = name.trim();

        if (!updatedName) {
            toast.error("নাম লিখুন", toastOptions);
            return;
        }

        if (updatedName === initialName) {
            toast.info("নামে কোনো পরিবর্তন করা হয়নি", toastOptions);
            return;
        }

        setUpdating(true);
        console.log("[Profile Update] Updating user name:", updatedName);

        try {
            const { data, error } = await authClient.updateUser({
                name: updatedName,
            });

            if (error) {
                console.error("[Profile Update] Update failed:", error);
                toast.error(
                    error.message || "প্রোফাইল আপডেট করা যায়নি",
                    toastOptions
                );
                return;
            }

            console.log("[Profile Update] Update successful:", data);

            toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে", toastOptions);
            router.push("/profile");
            router.refresh();
        } catch (error) {
            console.error("[Profile Update] Unexpected error:", error);
            toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে", toastOptions);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 pb-12 pt-6 sm:pt-8">
            <div className="mx-auto w-full max-w-[555px]">
                <div className="mb-5 flex justify-center">
                    <div className="relative h-[76px] w-[76px] overflow-hidden rounded-lg bg-[#d9d9d9]">
                        {userImage ? (
                            <Image
                                src={userImage}
                                alt={name || "Profile"}
                                fill
                                sizes="76px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-gray-500">
                                {(name || userEmail || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <h1 className="text-xl font-bold leading-7 text-[#263129]">
                        তথ্য পরিবর্তন
                    </h1>

                    <p className="mt-0.5 text-xs leading-5 text-[#68736a]">
                        আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন
                    </p>
                </div>

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
                            {updating ? "আপডেট হচ্ছে..." : "Update Information"}
                        </button>
                    </form>
                </section>

                <div className="mt-5 text-center">
                    <Link
                        href="/profile"
                        className="text-xs text-[#7b857c] transition hover:text-green-700"
                    >
                        ← প্রোফাইলে ফিরে যান
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function UpdateProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;

    React.useEffect(() => {
        if (!isPending && !user) {
            router.replace("/signin");
        }
    }, [isPending, user, router]);

    if (isPending || !user) {
        return (
            <main className="min-h-[calc(100vh-226px)] bg-[#f0f5f0] px-4 py-10">
                <div className="mx-auto max-w-[555px] animate-pulse">
                    <div className="mx-auto mb-5 h-[76px] w-[76px] rounded-lg bg-gray-200" />
                    <div className="mb-2 h-7 w-40 rounded bg-gray-200" />
                    <div className="mb-6 h-4 w-52 rounded bg-gray-200" />
                    <div className="h-[190px] rounded-xl bg-gray-200" />
                </div>
            </main>
        );
    }

    return (
        <UpdateForm
            key={user.id || user.email}
            initialName={user.name || ""}
            userImage={user.image}
            userEmail={user.email}
        />
    );
}
