"use client";
import Image from "next/image";
import Logo from "~/components/Logo";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center">
      <header className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-32 py-10 mb-6 md:mb-14">
        <Logo type="landing" />
        <button
          className={
            "text-xl md:text-2xl text-white bg-[#E75134] rounded-3xl py-2 px-14 border-8 border-[#FF8167] mb-2 cursor-pointer"
          }
          onClick={() => {
            router.push("/login");
          }}
        >
          Login
        </button>
      </header>

      <main className="flex flex-col items-center justify-center w-full text-center gap-10">
        <div>
          <h1 className="text-5xl md:text-7xl">MEMORIZE. PLAY. ENJOY</h1>
          <h1 className="text-5xl md:text-7xl">W/ FLIPPY</h1>
        </div>
        <button
          className={
            "text-xl md:text-2xl text-white bg-[#E75134] rounded-3xl py-2 px-14 border-8 border-[#FF8167] mb-2 cursor-pointer"
          }
          onClick={() => {
            router.push("/login");
          }}
        >
          Start playing now
        </button>
        <Image
          src="/grid.png"
          alt="Memory grid"
          height={416}
          width={640}
          priority
          className="z-10"
        />
      </main>
      <section className="bg-[#E75234] flex flex-col items-center justify-center w-full p-10 gap-4">
        <h1 className="text-6xl text-white">Features</h1>
        <div className="flex gap-10 justify-center items-center flex-wrap">
          <Image width={376} height={376} alt="Feature" src="/feature1.png" />
          <Image width={376} height={376} alt="Feature" src="/feature2.png" />
          <Image width={376} height={376} alt="Feature" src="/feature3.png" />
        </div>
      </section>
      <footer className="my-5">
        <p className="text-xl md:text-3xl text-center">©️2025 FLIPPY. MADE BY HUSAIN KHORAKIWALA</p>
      </footer>
    </div>
  );
}
