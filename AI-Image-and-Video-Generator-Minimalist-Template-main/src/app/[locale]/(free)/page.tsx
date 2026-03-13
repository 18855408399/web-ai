import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import { getMetadata } from "@/components/seo/seo";
import FaqClient from "@/components/landingpage/faq-client";
import PricingSection from "@/components/landingpage/pricing-section";
import {
  Video,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Clock,
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
  const video     = "/resources/example3.webm";
  const effectId  = "1";
  const multiLanguageOfGenerator = "HomePage.generator";

  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Image to Video (Kling v2.1)",
      desc: "Upload any photo as the starting frame, describe the motion you want, and Kling v2.1 animates it into a smooth HD video.",
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: "Text to Image (Flux 1.1 Pro)",
      desc: "Enter a text prompt and Flux 1.1 Pro generates a high-quality 1024×1024 image. No source photo needed.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Flexible Aspect Ratios",
      desc: "Choose 16:9 for landscape, 9:16 for vertical / short-form, or 1:1 for square — whichever fits your platform.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "5s or 10s Duration",
      desc: "Generate a 5-second quick clip or a 10-second extended sequence. Select before generating.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Upload Your Start Image",
      desc: "Choose a clear, well-lit photo as the first frame of your video. This is the required input for Kling v2.1.",
    },
    {
      num: "02",
      title: "Describe the Motion",
      desc: "Write a prompt describing what should happen: camera movements, character actions, lighting changes, or mood.",
    },
    {
      num: "03",
      title: "Pick Ratio & Duration, Then Generate",
      desc: "Select your aspect ratio (16:9 / 9:16 / 1:1) and duration (5s or 10s), hit Generate, and your video will be ready in ~2–3 minutes.",
    },
  ];

  return (
    <main className="flex flex-col items-center w-full">

      {/* ─── HERO + AI Generation ─── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 flex flex-col items-center justify-center min-h-screen w-full">
        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center mb-8 sm:mb-12 mt-10 md:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-8">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            Powered by Kling v2.1 &amp; Flux 1.1 Pro
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-2xl leading-tight">
            Your One-Stop AI Image &amp;{" "}
            <br className="hidden md:block" /> Video Creation Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 md:mb-12 font-medium drop-shadow-md px-4">
            Upload a photo, describe the motion, choose your format — and let
            AI bring it to life in minutes. No editing skills needed.
          </p>
        </div>

        <div className="w-full flex justify-center px-2 sm:px-4">
          <div className="w-full max-w-4xl">
            <WorkerWrapper
              effectId={effectId}
              promotion={video}
              lang={multiLanguageOfGenerator}
            />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-16 md:py-24 px-4 sm:px-6 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              What You Can Create
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
              Two AI generation tools. Fully functional. No extra setup required.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-inner">
                  {f.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 md:mb-3">
                  {f.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-6 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              Three Steps to Your AI Video
            </h2>
            <p className="text-white/80 text-base md:text-lg">
              No timeline editor. No software to install. Just upload, prompt, and generate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative p-6 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
              >
                <div className="text-6xl md:text-7xl font-black text-white/5 absolute top-2 right-4 select-none">
                  {step.num}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 relative z-10 mt-6 md:mt-8">
                  {step.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base relative z-10">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              Choose Your Creative Plan
            </h2>
            <p className="text-white/80 text-base md:text-lg">
              Start free with 20 credits. Scale as you grow. No hidden fees.
            </p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 w-full relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqClient />
        </div>
      </section>
    </main>
  );
}