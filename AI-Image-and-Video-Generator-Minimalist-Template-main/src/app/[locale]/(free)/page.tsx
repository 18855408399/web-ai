import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import { getMetadata } from "@/components/seo/seo";
import FaqClient from "@/components/landingpage/faq-client";
import {
  Sparkles,
  Play,
  Wand2,
  Palette,
  Download,
  Share2,
  Shield,
  Zap,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "HomePage.seo", "");
}

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const video = "/resources/example3.webm";
  const effectId = "1";
  const multiLanguageOfGenerator = "HomePage.generator";

  const examples = [
    { img: "/resources/example1.webp" },
    { img: "/resources/example2.webp" },
    { img: "/resources/example5.webp" },
  ];

  const features = [
    {
      icon: Wand2,
      title: "Realistic AI Animation",
      desc: "Turn static photos into vibrant video scenes that feel alive.",
    },
    {
      icon: Palette,
      title: "Prompt-Based Personalization",
      desc: "Write your scene, style, or emotion — our AI interprets and animates it.",
    },
    {
      icon: Download,
      title: "High-Resolution Exports",
      desc: "Download full-quality videos ready to post, share, or keep forever.",
    },
    {
      icon: Zap,
      title: "Intuitive Creation Process",
      desc: "No timeline, no tools — just you and your creativity.",
    },
    {
      icon: Share2,
      title: "Instant Sharing",
      desc: "Easily download or share your videos across all platforms.",
    },
    {
      icon: Shield,
      title: "Privacy & Data Protection",
      desc: "We safeguard your content with industry-standard security.",
    },
  ];

  return (
    <main className="flex flex-col items-center w-full bg-zinc-950">

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative w-full flex flex-col overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-zinc-950" />
        </div>

        {/* 文字 */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-10 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-8">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            Powered by Next-Gen AI Models
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none mb-6 tracking-tighter drop-shadow-2xl">
            Imagine it.
            <br />
            <span className="text-white/50">Generate it.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mb-10 font-light leading-relaxed">
            Turn your images into cinematic AI videos in seconds.
            <br className="hidden md:block" />
            No skills needed — just upload and generate.
          </p>
        </div>

        {/* WorkerWrapper 玻璃卡片 */}
        <div className="relative z-10 w-full flex justify-center px-4 pb-32">
          <div className="w-full max-w-4xl">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/5 rounded-[2rem] blur-lg opacity-40" />
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
      </section>

      {/* ───────────────────── EXAMPLES ───────────────────── */}
      <section className="w-full bg-zinc-950 py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-3">
              Showcase
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Real Videos from Real Users
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examples.map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
              >
                <img
                  src={item.img}
                  alt={`Example ${i + 1}`}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── WHAT ───────────────────── */}
      <section className="w-full bg-zinc-900 py-28 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">
              About
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Is AI Video Generator?
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              An AI-powered platform that transforms still images or text
              prompts into animated, emotionally rich videos.
            </p>
            <ul className="space-y-4">
              {[
                "Emotion-Driven Animation — infuse life into your photos",
                "Cinematic Quality Output — professional-grade results",
                "Multiple Style Options — romantic, surreal, action & more",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-300">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl">
            <img
              src="/resources/example3.webp"
              alt="AI Video Generator preview"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ───────────────────── HOW ───────────────────── */}
      <section className="w-full bg-zinc-950 py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-3">
              Process
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              How to Create Your First Video
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Image",
                desc: "Choose a clear, well-lit photo or enter a text prompt to get started.",
              },
              {
                step: "02",
                title: "Choose Your Style",
                desc: "Describe the mood — romantic, cinematic, surreal. The AI understands.",
              },
              {
                step: "03",
                title: "Generate & Download",
                desc: "Let the AI animate your story into a stunning video in seconds.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all duration-300"
              >
                <div className="text-6xl font-bold text-zinc-800 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── FEATURES ───────────────────── */}
      <section className="w-full bg-zinc-900 py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-3">
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Powerful Features to Fuel Your Creativity
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item) => (
              <div
                key={item.title}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center mb-4 transition-colors">
                  <item.icon className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── FAQ ───────────────────── */}
      <section className="w-full bg-zinc-950 py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-3">
              Support
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqClient />
        </div>
      </section>

      {/* ───────────────────── CTA ───────────────────── */}
      <section className="w-full bg-zinc-900 py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Turn Your Moments into Moving Stories
          </h2>
          <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
            AI Video Generator helps you transform everyday moments into
            cinematic animations using the power of artificial intelligence.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-zinc-900 font-semibold rounded-full hover:bg-zinc-100 transition-colors text-lg shadow-2xl"
          >
            Create Your First Video Now →
          </a>
        </div>
      </section>

    </main>
  );
}