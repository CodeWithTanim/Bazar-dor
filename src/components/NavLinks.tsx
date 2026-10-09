import { INavLink } from "@/type/NavLinks";
import Link from "next/link";
import React from "react";

const NavLinks = async () => {
    const res = await fetch(
        "https://api.api-store.workers.dev/api/bazardor/categories"
    );

    const data = await res.json();
    const navs: INavLink[] = data;

    return (
        <nav className="flex h-[49px] items-center justify-start gap-7 overflow-x-auto whitespace-nowrap text-[13px] font-semibold">
            {navs.map((nav) => (
                <Link
                    key={nav.id}
                    href={`/category/${nav.slug}`}
                    className="flex shrink-0 items-center gap-1.5 text-gray-800 transition-colors hover:text-green-700"
                >
                    <span>{nav.icon}</span>
                    <span>{nav.nameBn}</span>
                </Link>
            ))}
        </nav>
    );
};

export default NavLinks;
