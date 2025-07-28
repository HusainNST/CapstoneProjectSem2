"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND } from "~/constants/env";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Logo from "~/components/Logo";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import LoadingSpinner from "~/components/ui/LoadingSpinner";

export default function Login() {
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNotyf(new Notyf({}));
  }, []);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/auth/verify`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          router.push("/game");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = identifierRef.current?.value;
    const password = passwordRef.current?.value;

    if (!identifier || !password) {
      if (notyf) {
        notyf.error("Please fill in all fields.");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
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
      router.push("/game");
    } catch (error) {
      console.error("Error:", error);
      if (notyf) {
        notyf.error("Internal server error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 bg-gradient-to-b from-orange-100 to-orange-200">
      <Logo />
      <div className="flex flex-col p-2 md:p-5 items-center bg-white border-[6px] border-[#E75234] -mt-6 z-0 rounded-3xl w-full max-w-xl">
        <h1 className="text-3xl md:text-5xl font-bold text-black uppercase pt-2 px-2 text-center">
          Welcome Back!
        </h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <Input
            label="Email or Username"
            type="text"
            id="identifier"
            ref={identifierRef}
          />
          <Input 
            label="Password" 
            type="password" 
            id="pass" 
            ref={passwordRef}
          />
          <div className="px-2 mb-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xl md:text-2xl py-4 border-8"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
          <p className="text-center text-lg md:text-2xl">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-purple-600 hover:underline">
              Register here!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
