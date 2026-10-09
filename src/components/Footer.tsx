import React from "react";

const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200 bg-[#fbfdfb]">
            <div className="mx-auto flex min-h-[70px] max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 text-sm text-[#263129] sm:flex-row sm:items-center sm:gap-6 sm:px-6">
                <p>বাজার দর &nbsp;|&nbsp; প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>

                <p className="text-left sm:text-right">
                    সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
                </p>
            </div>
        </footer>
    );
};

export default Footer;
