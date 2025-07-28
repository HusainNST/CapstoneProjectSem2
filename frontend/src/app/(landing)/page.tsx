"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND } from "~/constants/env";
import Logo from "~/components/Logo";
import LandingGrid from "~/components/LandingGrid";
import Button from "~/components/ui/Button";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { FadeIn, Floating } from "~/components/ui/Animations";

interface FeatureCard {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  icon: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Memory Training",
    description: "Boost your cognitive abilities with challenging memory exercises designed to improve focus and concentration.",
    image: { src: "/feature1.png", alt: "Memory Training Feature", width: 320, height: 240 },
    icon: "🧠"
  },
  {
    title: "Multiple Levels",
    description: "Choose from Easy (4x4) or Hard (6x6) difficulty levels to match your skill and challenge yourself progressively.",
    image: { src: "/feature2.png", alt: "Multiple Difficulty Levels", width: 320, height: 240 },
    icon: "🎯"
  },
  {
    title: "Score Tracking",
    description: "Track your progress with detailed statistics, leaderboards, and personal best records to stay motivated.",
    image: { src: "/feature3.png", alt: "Score Tracking Feature", width: 320, height: 240 },
    icon: "📊"
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/auth/verify`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          router.push("/game");
          return;
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuthentication();
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center px-6 py-6 relative z-10">
        <Logo type="landing" />
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-700 hover:text-[#E75234] font-semibold transition-colors duration-300 px-4 py-2"
          >
            Login
          </button>
          <Button
            onClick={() => router.push("/register")}
            className="px-6 py-2 text-base font-semibold border-2 !text-white"
          >
            Get Started
          </Button>
        </div>
      </nav>

      <section className="relative w-full max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FFE5D9] rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-[#FFCAB0] rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 text-center">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-orange-200 mb-8 shadow-sm">
              <span className="text-2xl">🎮</span>
              <span className="text-[#E75234] font-semibold">Memory Game</span>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
                Train Your Brain with
                <br />
                <span className="text-transparent bg-gradient-to-r from-[#E75234] via-[#FF6B4A] to-[#FF8167] bg-clip-text">
                  Flippy
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-medium">
                The Ultimate Memory Challenge
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Challenge yourself with our interactive memory card game. Match pairs, beat your high scores, and compete with players worldwide!
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                onClick={() => router.push("/login")}
                className="w-full sm:w-auto px-8 py-4 text-xl font-bold bg-gradient-to-r from-[#E75234] to-[#FF6B4A] border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Playing Now →
              </Button>
              <button
                onClick={() => router.push("/login")}
                className="text-gray-700 hover:text-[#E75234] font-semibold transition-colors duration-300 px-6 py-4 border-2 border-gray-300 hover:border-[#E75234] rounded-2xl"
              >
                Login
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="w-full bg-gradient-to-br from-white to-orange-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Try It Out!
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Get a taste of the challenge with our interactive demo below
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100 hover-lift">
              <LandingGrid />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Flippy?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make our memory game the perfect brain training experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {FEATURE_CARDS.map((feature, index) => (
              <FadeIn key={index} delay={index * 150} direction="up">
                <div className="group">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover-lift">
                    <Floating delay={index * 100} intensity="light">
                      <div className="text-6xl mb-6 text-center">
                        {feature.icon}
                      </div>
                    </Floating>
                    
                    <div className="relative mb-6 rounded-2xl overflow-hidden">
                      <Image
                        width={feature.image.width}
                        height={feature.image.height}
                        alt={feature.image.alt}
                        src={feature.image.src}
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gradient-to-r from-[#E75234] via-[#FF6B4A] to-[#FF8167] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Challenge Your Mind?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of players who are already sharpening their memory skills with Flippy!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/register")}
              className="w-full sm:w-auto px-8 py-4 text-xl font-bold !bg-white !text-[#E75234] border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Create Free Account
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto px-8 py-4 text-xl font-bold bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#E75234] transition-all duration-300"
            >
              I Already Have an Account
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo type="landing" />
              <p className="text-gray-400 mt-2">
                Train your brain, one flip at a time.
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-lg font-semibold text-gray-300">
                © 2025 FLIPPY
              </p>
              <p className="text-gray-400">
                Made by Husain Khorakiwala
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
