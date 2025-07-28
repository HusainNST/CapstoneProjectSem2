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

const usernameRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export default function Register() {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);
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
    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passRef.current?.value;
    const confirmPassword = confirmPassRef.current?.value;

    if (!username || !usernameRegex.test(username)) {
      if (notyf) {
        notyf.error("Please enter a valid username");
      }
      return;
    }

    if (!email || !emailRegex.test(email)) {
      if (notyf) {
        notyf.error("Please enter a valid email address");
      }
      return;
    }

    if (!password || !passwordRegex.test(password)) {
      if (notyf) {
        notyf.error(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
      }
      return;
    }

    if (password !== confirmPassword) {
      if (notyf) {
        notyf.error("Passwords do not match");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
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
          Welcome!
        </h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <Input label="Email" type="text" id="email" ref={emailRef} />
          <Input label="Username" type="text" id="username" ref={usernameRef} />
          <Input label="Password" type="password" id="pass" ref={passRef} />
          <Input
            label="Confirm Password"
            type="password"
            id="confirmPass"
            ref={confirmPassRef}
          />
          <div className="px-2 mb-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xl md:text-2xl py-4 border-8"
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </Button>
          </div>
          <p className="text-center text-lg md:text-2xl">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-600 hover:underline">
              Login here!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
