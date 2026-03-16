// src/components/landingpage/hero-section.tsx
"use client"; // 增加 use client 以支持背景视频

import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import { Sparkles, Video } from 'lucide-react';

interface HeroSectionProps {
  video: string; // 这里通常存放示例视频 URL
  effectId: string;
  multiLanguageOfGenerator: string;
}

export default function HeroSection({ 
  video, 
  effectId, 
  multiLanguageOfGenerator 
}: HeroSectionProps) {
  // 一个深色、抽象、缓慢流动的 Kling 风格示例视频
  const BG_VIDEO_URL = "https://replicate.delivery/pbxt/IZYkI2o0vYlMIdW9YjG9fM6A1wG1rG1eG1rG1e/output.mp4";

  return (
    <div className="relative w-full flex flex-col overflow-hidden bg-black min-h-[95vh]">
      
      {/* ── 全景动态视频背景 ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-40 filter blur-[2px]"
        >
          <source src={BG_VIDEO_URL} type="video/mp4" />
        </video>
        {/* 深色遮罩，确保文字清晰 */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
      </div>

      {/* 文字区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-28 pb-10 px-4 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/50 backdrop-blur-xl border border-blue-500/30 text-blue-200 text-xs font-bold mb-8 tracking-widest uppercase animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Powered by Kling 2.1 Engine
        </div>

        {/* 主标题 - 更电影感、更粗 */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          STUDIO
          <br />
          <span className="text-white/40">REALITY AI</span>
        </h1>

        {/* 副标题 */}
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mb-12 font-medium leading-relaxed">
          Create cinematic AI videos in seconds. 
          <br className="hidden md:block" />
          Join the elite <span className="text-blue-400 font-bold">1%</span> of creators defining the future.
        </p>
      </div>

      {/* ── 核心生成区域 (彻底去白框，改为 Frosted Glass) ── */}
      <div className="relative z-10 w-full flex justify-center items-center px-4 pb-32">
        <div className="w-full max-w-5xl">
          <div className="relative group">
            {/* 外部氛围光晕 */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-1000" />
            
            {/* 核心深色玻璃容器 */}
            <div className="relative bg-zinc-950/70 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 md:p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
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