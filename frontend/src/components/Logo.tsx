import Image from "next/image";
import Link from "next/link";

interface Props {
  type?: string;
}
export default function Logo({ type }: Props) {
  return (
    <Link
      href="/"
      className="cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95">

      {/* Mobile */}
      <div className="block md:hidden">
        <h1 className="text-3xl font-bold text-[#E85335] hover:opacity-90 transition-all duration-300 hover:drop-shadow-lg">
          Flippy
        </h1>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <Image
          src="/FlippyLogo.png"
          alt="Flippy logo"
          height={117}
          width={434}
          priority
          className={`${
            !type && "h-auto w-[576]"
          } z-10 hover:opacity-90 transition-all duration-300 hover:drop-shadow-lg`}
        />
      </div>
    </Link>
  );
}
