"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg"
      onClick={() => signIn("google")}
    >
      Start for Free
    </button>
  );
}