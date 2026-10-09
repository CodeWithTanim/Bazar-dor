"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Slide, toast } from "react-toastify";

const UserInfo = () => {
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session?.user;

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("সাইন আউট করতে সমস্যা হয়েছে", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Slide,
        });

        return;
      }

      setMenuOpen(false);

      toast.success("সফলভাবে সাইন আউট হয়েছে", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Slide,
      });

      window.location.href = "/";
    } catch (error) {
      console.error("[Signout] Failed:", error);

      toast.error("সাইন আউট করতে সমস্যা হয়েছে", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
        transition: Slide,
      });
    }
  };

  if (isPending) {
    return (
      <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-5">
        <Link
          href="/signin"
          className="text-sm font-semibold text-gray-800 transition-colors hover:text-green-700"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_3px_0_#065f46,0_5px_7px_rgba(0,0,0,0.18)] transition-all duration-150 hover:bg-green-800 active:translate-y-0.5 active:shadow-none"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label="প্রোফাইল মেনু"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
      >
        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "Profile"}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
              {(user.name || user.email || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </span>

        <span className="max-w-[120px] truncate text-sm font-medium text-[#263129]">
          {user.name || user.email}
        </span>

        <svg
          className={`h-3 w-3 shrink-0 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""
            }`}
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
      </button>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="মেনু বন্ধ করুন"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-2 w-[194px] overflow-hidden rounded-[14px] border border-[#e5e9e5] bg-[#fbfdfb] shadow-[0_4px_10px_rgba(0,0,0,0.14)]">
            <div className="px-4 pb-2 pt-3">
              <p className="truncate text-xs font-bold leading-5 text-[#263129]">
                {user.name || "ব্যবহারকারী"}
              </p>

              <p className="truncate text-[10px] leading-4 text-[#68736a]">
                {user.email}
              </p>
            </div>

            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-[#37443a] transition hover:bg-[#f0f5f0]"
            >
              <span className="text-sm">👤</span>
              <span>আমার প্রোফাইল</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-1.5 px-4 pb-3 pt-1.5 text-left text-xs text-red-600 transition hover:bg-red-50"
            >
              <span className="text-sm">↪</span>
              <span>সাইন আউট</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInfo;
