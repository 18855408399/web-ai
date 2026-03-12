import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import { getMetadata } from "@/components/seo/seo";
import FaqClient from "@/components/landingpage/faq-client";
import {
  Video,
  Image as ImageIcon,
  Layers,
  Sparkles,
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

  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Text to Video",
      desc: "Transform detailed descriptions into cinematic scenes with automatic camera work and lighting.",
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: "Image to Video",
      desc: "Bring static images to life with natural motion, transitions, and narrative continuity.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multi-Shot Storytelling",
      desc: "Single prompt generates coordinated multi-camera sequences with professional transitions.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Reference Video",
      desc: "Upload reference clips to maintain consistent characters, voices, and styles across your project.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Write What You Imagine",
      desc: "Enter a detailed text description, upload an image, or provide a video reference.",
    },
    {
      num: "02",
      title: "Fine-Tune Your Creation",
      desc: "Adjust video length, aspect ratio, resolution, and generation style.",
    },
    {
      num: "03",
      title: "Your Video, Ready",
      desc: "Click generate and return to a fully-produced video with professional quality.",
    },
  ];

  return (
    <main className="flex flex-col items-center w-full">
      {/* ─── HERO + AI Generation ─── */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 flex flex-col items-center justify-center min-h-screen w-full">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-8">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            Powered by Next-Gen AI Models
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-lg leading-tight">
            Your One-Stop AI Image &{" "}
            <br className="hidden md:block" /> Video Creation Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light drop-shadow-md px-4">
            No camera. No crew. Just describe your vision and let AIO bring it
            to life with stunning quality in seconds.
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
      <section className="py-16 md:py-24 px-4 sm:px-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              Everything You Need to Create
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
              Four powerful generation modes. Infinite creative possibilities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl hover:bg-white/20 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6">
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
      <section className="py-16 md:py-24 px-4 sm:px-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              Three Steps to Stunning Videos
            </h2>
            <p className="text-white/70 text-base md:text-lg">
              No learning curve. No software to install.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden"
              >
                <div className="text-6xl md:text-7xl font-black text-white/5 absolute top-2 right-4 select-none">
                  {step.num}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 relative z-10 mt-6 md:mt-8">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm md:text-base relative z-10">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 w-full">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqClient />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
            Turn Your Moments into Moving Stories
          </h2>
          <p className="text-white/70 text-lg mb-12 leading-relaxed">
            Transform everyday moments into cinematic animations using the power
            of artificial intelligence.
          </p>
          <a
            href={`/${locale}/pricing`}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-lg shadow-2xl"
          >
            Start Creating Now →
          </a>
        </div>
      </section>
    </main>
  );
}