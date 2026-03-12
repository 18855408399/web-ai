// src/app/[locale]/(free)/page.tsx
import HeroSection from "@/components/landingpage/hero-section";
import What from "@/components/landingpage/what";
import How from "@/components/landingpage/how";
import Faq from "@/components/landingpage/faq";
import FeatureHero from "@/components/landingpage/feature";
import { getMetadata } from "@/components/seo/seo";
import UserExample from "@/components/landingpage/example";
import Cta from "@/components/landingpage/cta";

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
  const images = [
    { img: "/resources/example1.webp", video: "/resources/example1.mp4" },
    { img: "/resources/example2.webp", video: "/resources/example2.mp4" },
    { img: "/resources/example5.webp", video: "/resources/example5.mp4" },
  ];

  const video = "/resources/example3.webm";
  const whatImage = "/resources/example3.webp";
  const howImage = "/resources/example2.webp";
  const effectId = "1";
  const multiLanguage = "HomePage";
  const multiLanguageOfGenerator = "HomePage.generator";

  return (
    // ✅ 去掉了原来的 padding 和 rounded，让背景图可以铺满
    <main className="flex flex-col items-center w-full">
      
      {/* ✅ 全新的英雄区域 */}
      <div className="w-full">
        <HeroSection
          video={video}
          effectId={effectId}
          multiLanguageOfGenerator={multiLanguageOfGenerator}
        />
      </div>

      {/* ✅ 以下保持原样，都是你的原有组件 */}
      <div className="pt-20 md:pt-40 w-full px-3 md:px-0">
        <UserExample multiLanguage={multiLanguage} images={images} />
      </div>

      <div className="pt-20 md:pt-40 w-full px-3 md:px-0">
        <What multiLanguage={multiLanguage} image={whatImage} />
      </div>

      <div className="pt-20 md:pt-40 w-full px-3 md:px-0">
        <How multiLanguage={multiLanguage} image={howImage} />
      </div>

      <div className="pt-20 md:pt-40 w-full px-3 md:px-0">
        <FeatureHero multiLanguage={multiLanguage} />
      </div>

      <div className="pt-20 md:pt-40 w-full px-3 md:px-0">
        <Faq multiLanguage={multiLanguage} grid={true} />
      </div>

      <div className="py-20 md:py-40 w-full px-3 md:px-0">
        <Cta multiLanguage={multiLanguage} />
      </div>
    </main>
  );
}