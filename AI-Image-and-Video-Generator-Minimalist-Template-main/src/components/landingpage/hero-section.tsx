// src/components/landingpage/hero-section.tsx
// ✅ 不加 "use client" —— 保持服务端组件

import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  video: string;
  effectId: string;
  multiLanguageOfGenerator: string;
}

export default function HeroSection({ 
  video, 
  effectId, 
  multiLanguageOfGenerator 
}: HeroSectionProps) {
  return (
    <div className="relative w-full flex flex-col overflow-hidden bg-zinc-900">
      
      {/* 背景图 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop" 
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />
      </div>

      {/* 文字区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-20 pb-10 px-4 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-8">
          <Sparkles className="w-3 h-3 text-yellow-300" />
          Powered by Next-Gen AI Models
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none mb-6 tracking-tighter drop-shadow-2xl">
          Imagine it.
          <br />
          <span className="text-white/60">Generate it.</span>
        </h1>

        {/* 副标题 */}
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mb-6 font-light leading-relaxed">
          Turn your images into cinematic AI videos in seconds.
          <br className="hidden md:block" />
          No skills needed — just upload and generate.
        </p>
      </div>

      {/* WorkerWrapper */}
      <div className="relative z-10 w-full flex justify-center items-center px-4 pb-24">
        <div className="w-full max-w-4xl">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/5 rounded-[2rem] blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-2xl">
              <WorkerWrapper
                effectId={effectId}
                promotion={video}
                lang={multiLanguageOfGenerator}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}