import TextToImageWrapper from "@/components/replicate/text-to-image/worker-wraper";
import TabSwitcher from "@/components/replicate/tab-switcher";
import { getMetadata } from "@/components/seo/seo";
import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import { Sparkles } from "lucide-react";

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
            Upload a photo and animate it into a video, or generate stunning
            images from text — all in one place.
          </p>
        </div>

        {/* ─── 两个功能 Tab 切换 ─── */}
        <div className="w-full flex justify-center px-2 sm:px-4">
          <div className="w-full max-w-4xl">
            <TabSwitcher
              videoContent={
                <WorkerWrapper
                  effectId={effectId}
                  promotion={video}
                  lang={multiLanguageOfGenerator}
                />
              }
              imageContent={
                <TextToImageWrapper
                  effectId="2"
                  multiLanguage="TextToImage"
                  outputDefaultImage="/resources/example1.webp"
                />
              }
            />
          </div>
        </div>
      </section>
    </main>
  );
}