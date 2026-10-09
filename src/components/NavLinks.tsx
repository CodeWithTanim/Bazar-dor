"use client";

import { INavLink } from "@/type/NavLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const defaultCategories: INavLink[] = [
    { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
    { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
    { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
    { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
    { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
    { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
    { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥚" },
    { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

const NavLinks = () => {
    const pathname = usePathname();
    const [navs, setNavs] = useState<INavLink[]>(defaultCategories);

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch(
                    "https://api.api-store.workers.dev/api/bazardor/categories"
                );
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setNavs(data);
                    }
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        }

        loadCategories();
    }, []);

    return (
        <nav className="flex h-[49px] items-center justify-start gap-7 overflow-x-auto whitespace-nowrap text-[13px] font-semibold">
            {navs.map((nav) => {
                const isActive = pathname === `/category/${nav.slug}`;

                return (
                    <Link
                        key={nav.id}
                        href={`/category/${nav.slug}`}
                        className={`flex shrink-0 items-center gap-1.5 transition-colors ${
                            isActive
                                ? "text-green-700 font-bold"
                                : "text-gray-800 hover:text-green-700"
                        }`}
                    >
                        <span>{nav.icon}</span>
                        <span>{nav.nameBn}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default NavLinks;
