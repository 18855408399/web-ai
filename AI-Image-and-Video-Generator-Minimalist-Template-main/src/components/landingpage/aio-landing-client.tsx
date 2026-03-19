"use client";

import React, { ReactNode } from "react";

export default function AIOLandingClient({
  generator,
}: {
  generator: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-black" />

      {/* 主内容 */}
      <main className="relative z-10 pt-24 flex flex-col items-center px-4">
        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          {generator}
        </div>
      </main>
    </div>
  );
}