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
    <div className="relative w-full flex flex-col items-center justify-start overflow-hidden bg-[#050505] min-h-[95vh]">
      
      {/* ── Pollo 风格：深空紫极光背景 ── */}
      <div className="absolute inset-0 z-0">
        {/* 中心发光 */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full opacity-50" />
        {/* 底部微光 */}
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-purple-950/20 to-transparent opacity-40" />
      </div>

      {/* 文字区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-32 pb-12 px-4 text-center">
        
        {/* Badge：改为紫色系 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111] border border-purple-900/30 text-purple-400 text-xs font-semibold mb-10 tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          Kling 2.1 Studio Engine
        </div>

        {/* 主标题 - 使用渐变 */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] mb-8 tracking-tighter">
          <span className="title-gradient">IMAGINE</span>
          <br />
          <span className="text-white/20">REALITY AI</span>
        </h1>

        {/* 副标题 */}
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-14 font-light leading-relaxed">
          Create cinematic AI videos in seconds. 
          <br className="hidden md:block" />
          Join the elite <span className="text-purple-500 font-bold">1%</span> of creators defining the future.
        </p>
      </div>

      {/* ── 核心生成容器：使用 Pollo-Block 统一风格 ── */}
      <div className="relative z-10 w-full flex justify-center items-center px-4 pb-40">
        <div className="w-full max-w-5xl">
          <div className="relative group">
            {/* 背后淡淡的紫色呼吸灯效果 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
            
            {/* 核心容器：直接使用定义的 pollo-block 样式 */}
            <div className="relative pollo-block p-2 md:p-4 shadow-2xl">
              <div className="bg-[#050505]/50 rounded-[1.5rem] overflow-hidden">
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

      {/* 底部装饰线，增加高级感 */}
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </div>
  );
}