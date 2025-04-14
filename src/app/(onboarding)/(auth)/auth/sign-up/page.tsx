import Signup from "@/app/(onboarding)/_components/Signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <h1 className="mt-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
        Sign Up!
      </h1>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card w-full max-w-2xl">
        <div className="flex flex-wrap items-center">
          <div className="w-full">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signup />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
