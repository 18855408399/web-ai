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
    <div className="relative w-full flex flex-col items-center justify-start overflow-hidden bg-black min-h-[90vh]">
      
      {/* ── 深空极光氛围背景 ── */}
      <div className="absolute inset-0 z-0">
        {/* 左上极光 */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-900/40 to-transparent blur-[150px] opacity-70" />
        {/* 右下极光 */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-900/30 to-transparent blur-[150px] opacity-60" />
      </div>

      {/* 文字区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-28 pb-10 px-4 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-blue-300 text-xs font-medium mb-8 tracking-widest uppercase animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Powered by Kling 2.1 Studio Engine
        </div>

        {/* 主标题 - 电影感 */}
        <h1 className="title-master text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter">
          IMAGINE
          <br />
          <span className="text-white/30">REALITY AI</span>
        </h1>

        {/* 副标题 */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed">
          Create cinematic AI videos in seconds. 
          <br className="hidden md:block" />
          Join the elite <span className="text-blue-500 font-bold">1%</span> of creators defining the future.
        </p>
      </div>

      {/* ── 统一美术 & 尺寸的核心生成容器 ── */}
      <div className="relative z-10 w-full flex justify-center items-center px-4 pb-32">
        <div className="w-full max-w-5xl">
          <div className="relative group">
            {/* 氛围光晕 */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-1000" />
            
            {/* 核心赛博黑容器 (统一风格) */}
            <div className="relative bg-black border border-zinc-900 rounded-[2.5rem] p-3 md:p-6 shadow-2xl overflow-hidden">
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