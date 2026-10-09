
import Link from "next/link";
import React from "react";

const UserInfo = () => {
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
};

export default UserInfo;
