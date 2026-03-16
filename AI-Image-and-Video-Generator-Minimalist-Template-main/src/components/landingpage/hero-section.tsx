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
    <div className="relative w-full flex flex-col overflow-hidden bg-black min-h-[90vh]">
      {/* 极光渐变补丁层 */}
      <div className="aurora-bg" />

      {/* 文字区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-12 px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <Sparkles className="w-3 h-3 text-blue-400" />
          Powered by Kling 2.1 & Flux 1.1 Pro
        </div>

        {/* 主标题 */}
        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
          IMAGINE <span className="text-blue-500 italic">STUDIO</span>
          <br />
          <span className="text-white/30">REALITY AI</span>
        </h1>

        {/* 副标题 */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-medium leading-relaxed">
          Create cinematic AI videos and hyper-real images in minutes. 
          <span className="text-white"> Join the elite 1% of creators today.</span>
        </p>
      </div>

      {/* WorkerWrapper 区域 */}
      <div className="relative z-10 w-full flex justify-center items-center px-4 pb-32">
        <div className="w-full max-w-5xl">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 md:p-6 shadow-2xl">
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