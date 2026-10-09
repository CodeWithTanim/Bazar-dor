
import React from "react";
import NavLinks from "./NavLinks";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-icon.png";
import UserInfo from "./UserInfo";

const Header = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
    });

    return (
        <header className="w-full bg-[#f9fbf9]">
            {/* Header top row */}
            <div className="border-b border-gray-100">
                <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-700">
                            <Image
                                src={logo}
                                width={30}
                                height={30}
                                alt="Bazar Dor"
                                className="object-contain"
                            />
                        </div>

                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold leading-6 text-gray-900">
                                বাজার দর
                            </h2>

                            <p className="mt-1 text-xs leading-4 text-gray-600">
                                {date}
                            </p>
                        </div>
                    </Link>

                    <UserInfo />
                </div>
            </div>

            {/* Category navigation row */}
            <div className="border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4">
                    <NavLinks />
                </div>
            </div>
        </header>
    );
};

export default Header;
