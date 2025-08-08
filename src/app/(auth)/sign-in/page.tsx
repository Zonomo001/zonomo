"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Poppins } from "next/font/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SignInValidator, TSignInValidator } from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { useUserStore } from "@/hooks/use-auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "600"],
});

const SignInForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const originParam = searchParams.get("origin") || "";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInValidator>({
    resolver: zodResolver(SignInValidator),
  });

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: async () => {
      toast.success("Signed in successfully");
      
      useUserStore.getState().refetch();
      router.refresh();
      
      if (originParam) {
        const target = originParam.startsWith("/") ? originParam : `/${originParam}`;
        router.push(target);
        return;
      }

      router.push("/");
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password.");
      } else {
        toast.error("Sign-in failed. Please try again.");
      }
    },
  });

  const onSubmit = ({ email, password }: TSignInValidator) => {
    signIn({ email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="w-full lg:w-auto lg:flex-shrink-0 px-4 lg:px-0">
      <div className="bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 w-full lg:w-[450px] max-w-md mx-auto lg:mx-0">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl text-white mb-2">
            Sign In to Your Account
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <div className="relative">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className={cn(
                    "w-full h-12 bg-white/10 border-purple-400/30 text-white placeholder:text-purple-200 rounded-lg pl-12 pr-4 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all",
                    {
                      "border-red-400 focus:ring-red-400": errors.email,
                    }
                  )}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-purple-400/50 rounded flex items-center justify-center">
                    <span className="text-xs text-white">@</span>
                  </div>
                </div>
              </div>
              {errors?.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={cn(
                    "w-full h-12 bg-white/10 border-purple-400/30 text-white placeholder:text-purple-200 rounded-lg pl-12 pr-12 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all",
                    {
                      "border-red-400 focus:ring-red-400": errors.password,
                    }
                  )}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 bg-purple-400/50 rounded flex items-center justify-center">
                    <span className="text-xs text-white">🔒</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁" : "👁"}
                </button>
              </div>
              {errors?.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-purple-300 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-purple-300 text-sm">
            Don't have an account?{" "}
          </span>
          <Link
            href="/sign-up"
            className="text-white hover:text-purple-200 font-semibold text-sm transition-colors"
          >
            Sign up here
          </Link>
        </div>

        <div className="mt-4">
          <Button
            onClick={() => router.push("/seller/sign-in")}
            variant="outline"
            className="w-full h-12 bg-transparent border-purple-400/30 text-purple-300 hover:bg-white/10 hover:text-white hover:border-purple-300 transition-all"
            disabled={isLoading}
          >
            Continue as seller
          </Button>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div
      className={cn(
        poppins.className,
        "min-h-screen zonomo-gradient p-2 sm:p-4"
      )}
    >
      <div className="min-h-screen flex flex-col lg:items-end lg:justify-around">
        <div className="lg:hidden text-center pt-8 pb-12">
          <h1
            className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight"
            style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)" }}
          >
            ZONOMO
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 leading-relaxed font-light px-4">
            Zonomo connects you with a trusted home service partner.
          </p>
        </div>

        <div className="w-full max-w-7xl mx-auto flex-1 lg:flex lg:items-center lg:justify-center">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 lg:gap-16">
            {/* Desktop Branding - Left side */}
            <div className="hidden lg:flex flex-col justify-center items-start pr-24">
              <div className="max-w-md xl:max-w-lg">
                <h1
                  className="text-6xl xl:text-9xl font-bold text-white mb-6 tracking-tight"
                  style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)" }}
                >
                  ZONOMO
                </h1>
                <p className="text-xl xl:text-2xl text-purple-200 leading-relaxed font-light">
                  Zonomo connects you with a trusted home service partner.
                </p>
              </div>
            </div>

            {/* Right side - Login form wrapped in Suspense */}
            <Suspense 
              fallback={
                <div className="w-full lg:w-auto lg:flex-shrink-0 px-4 lg:px-0">
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 w-full lg:w-[450px] max-w-md mx-auto lg:mx-0">
                    <div className="animate-pulse">
                      <div className="h-8 bg-white/20 rounded mb-6"></div>
                      <div className="space-y-4">
                        <div className="h-12 bg-white/20 rounded"></div>
                        <div className="h-12 bg-white/20 rounded"></div>
                        <div className="h-12 bg-white/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <SignInForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
