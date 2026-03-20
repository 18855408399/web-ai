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
    <div className="relative w-full flex flex-col items-center justify-start overflow-hidden bg-[#020202] min-h-screen">
      
      {/* ── 电影级极光氛围背景 ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* 左上角深紫呼吸灯 */}
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full opacity-60 animate-pulse" />
        {/* 右侧幽灵绿微光 */}
        <div className="absolute top-[20%] -right-[5%] w-[40%] h-[50%] bg-green-500/5 blur-[100px] rounded-full opacity-40" />
        {/* 底部渐变遮罩，确保衔接自然 */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#020202] via-[#020202]/90 to-transparent" />
      </div>

      {/* 文字区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-28 pb-12 px-4 text-center">
        
        {/* 悬浮 Badge */}
        <div className="group cursor-default inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/50 text-[10px] font-bold mb-10 tracking-[0.3em] uppercase backdrop-blur-md hover:border-white/20 transition-all duration-500">
          <Sparkles className="w-3.5 h-3.5 text-green-400 fill-green-400/20" />
          Next-Gen AI Video Engine
        </div>

        {/* 主标题 - 极致紧缩排版 */}
        <h1 className="text-7xl md:text-9xl font-black leading-[0.85] mb-8 tracking-tighter text-white">
          <span className="inline-block transform hover:translate-y-[-2px] transition-transform duration-700">BEYOND</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">IMAGINATION</span>
        </h1>

        {/* 副标题 */}
        <p className="text-base md:text-lg text-zinc-500 max-w-xl mb-14 font-medium tracking-tight leading-relaxed">
          The professional standard for cinematic AI production. 
          <br className="hidden md:block" />
          <span className="text-zinc-300">Transform prompt to reality in ultra-high resolution.</span>
        </p>
      </div>

      {/* ── 核心生成容器：Vidflux 风格高透毛玻璃 ── */}
      <div className="relative z-10 w-full flex justify-center items-center px-4 pb-32">
        <div className="w-full max-w-5xl relative group">
          {/* 容器背后的动态光晕 */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-green-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative vid-card p-1.5 md:p-2 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
            <div className="bg-[#080808]/90 rounded-[18px] overflow-hidden border border-white/[0.03]">
              <WorkerWrapper
                effectId={effectId}
                promotion={video}
                lang={multiLanguageOfGenerator}
              />
            </div>
          </div>

          {/* 底部装饰提示 */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-gradient-to-b from-zinc-800 to-transparent" />
            <p className="text-[10px] text-zinc-600 tracking-[0.25em] uppercase font-bold">
              Powered by Flux 1.1 Pro & Kling Studio
            </p>
          </div>
        </div>
      </div>

      {/* 极细底部装饰线 */}
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />
    </div>
  );
}