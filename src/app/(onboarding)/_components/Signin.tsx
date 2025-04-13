"use client";

import Link from "next/link";
import GoogleSigninButton from "./GoogleSigninButton";
import SigninWithPassword from "./SigninWithPassword";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";


export default function Signin() {

    const searchParams = useSearchParams();
    const message = searchParams.get("message");

  return (
    <>
      <GoogleSigninButton text="Sign in" />

      {message === "signin_required" && (
        <p className="text-lg text-red-500 mb-4 mt-4">
          You must be signed in to access that page.
        </p>
      )}
      <div className="my-6 flex items-center justify-center">

        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <Suspense>
          <SigninWithPassword />
        </Suspense>
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}