import Image from "next/image";
import heroImage from "../../public/bazar-hero.png";

export default function Home() {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-[30px]">
      <section className="mx-auto flex min-h-[289px] max-w-6xl flex-col items-center justify-between gap-8 rounded-[26px] border border-[#dce7dc] bg-[#fbfdfb] px-5 py-6 sm:px-8 md:flex-row md:gap-10 md:px-4 lg:px-4">
        {/* Left Content */}
        <div className="w-full md:flex-1">
          <span className="inline-flex rounded-full bg-[#e1f1e7] px-3 py-1 text-sm font-medium text-green-700">
            {date}
          </span>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1c2920] sm:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-5 max-w-xl text-base leading-6 text-[#6b756d]">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম , বাজারভিত্তিক
            বিশ্লেষণ, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-7 inline-flex h-[42px] items-center justify-center rounded-lg bg-green-700 px-6 text-sm font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.2)] transition-colors hover:bg-green-800"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        {/* Right Hero Image */}
        <div className="flex w-full items-center justify-center md:w-[300px] md:shrink-0">
          <Image
            src={heroImage}
            alt="বাজারের তাজা পণ্য"
            priority
            className="h-auto w-[220px] object-contain sm:w-[250px] md:w-[250px]"
          />
        </div>
      </section>

      {/* Products Section */}
      <section>{/* product */}</section>
    </main>
  );
}
