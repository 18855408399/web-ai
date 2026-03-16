import PricingSection from "@/components/landingpage/pricing-section";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "Pricing.seo", "pricing");
}

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center pt-32 pb-24 px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
          Choose Your Creative Plan
        </h2>
        <p className="text-white/80 text-base md:text-lg">
          Start free. Scale as you grow. No hidden fees.
        </p>
      </div>
      <div className="w-full max-w-7xl">
        <PricingSection />
      </div>
    </div>
  );
}