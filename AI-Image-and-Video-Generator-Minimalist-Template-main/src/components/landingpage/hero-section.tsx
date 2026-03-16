"use client";

import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import { Sparkles } from 'lucide-react';

export default function HeroSection({ video, effectId, multiLanguageOfGenerator }: any) {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start pt-32 px-4 overflow-hidden bg-[#050505]">
      
      {/* 氛围背景 */}
      <div className="aurora-blur top-[-10%] left-[-10%]" />
      <div className="aurora-blur bottom-[10%] right-[-10%] !bg-purple-900/10" />

      {/* 顶部微章 */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6 animate-pulse">
        <Sparkles className="w-3 h-3" />
        Kling 2.1 Next-Gen Engine Active
      </div>

      {/* 电影感标题 */}
      <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-center mb-6">
        MAKE MAGIC <br /> <span className="opacity-80">WITH LIGHT</span>
      </h1>

      <p className="text-zinc-400 text-lg md:text-xl text-center max-w-2xl mb-12 leading-relaxed">
        Transform static imagination into cinematic reality. 
        Professional grade AI video tools, now at your fingertips.
      </p>

      {/* 核心工作区容器 - 彻底解决 Bug 的包裹层 */}
      <div className="relative z-10 w-full max-w-5xl shimmer-premium rounded-[2.5rem] border border-white/5 bg-zinc-900/40 backdrop-blur-3xl p-2 md:p-4 shadow-2xl">
        <div className="rounded-[2rem] overflow-hidden bg-black/20">
          <WorkerWrapper
            effectId={effectId}
            promotion={video}
            lang={multiLanguageOfGenerator}
          />
        </div>
      </div>

      {/* 装饰底座 */}
      <div className="mt-20 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </section>
  );
}