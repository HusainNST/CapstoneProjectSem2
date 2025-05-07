"use client";
import Link from "next/link";
import Input from "~/components/ui/Input";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND } from "~/constants/env";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Logo from "~/components/Logo";

export default function Register() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [notyf, setNotyf] = useState<Notyf | null>(null);

  useEffect(() => {
    setNotyf(new Notyf({}));
  }, []);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`${BACKEND}/verify`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    verify();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    if (!email || !password) {
      if (notyf) {
        notyf.error("Please fill in all fields.");
      }
      return;
    }

    try {
      const response = await fetch(`${BACKEND}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (notyf) {
          notyf.error(errorData.error);
        }
        return;
      }
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      if (notyf) {
        notyf.error("Internal server error");
      }
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4">
      <Logo />
      <div className="flex flex-col p-2 md:p-5 items-center bg-white border-[6px] border-[#E75234] -mt-6 z-0 rounded-3xl w-full max-w-xl">
        <h1 className="text-3xl md:text-5xl font-bold text-black uppercase pt-2 px-2 text-center">
          Welcome!
        </h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <Input label="Email" type="text" id="email" ref={emailRef} />
          <Input label="Password" type="password" id="pass" ref={passRef} />
          <button
            className={
              "text-xl md:text-2xl text-white bg-[#E75134] rounded-3xl py-4 border-8 border-[#FF8167] mb-2 w-full cursor-pointer"
            }
          >
            Register
          </button>
          <p className="text-center text-lg md:text-2xl">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-purple-600">
              Register here!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
