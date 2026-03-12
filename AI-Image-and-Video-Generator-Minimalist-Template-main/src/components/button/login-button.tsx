"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      className="bg-white/90 backdrop-blur-md text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-white transition-colors shadow-lg"
      onClick={() => signIn("google")}
    >
      Sign In
    </button>
  );
}