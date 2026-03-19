import FaqClient from "@/components/landingpage/faq-client";

export default function FaqPage() {
  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 w-full">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            Frequently Asked Questions
          </h1>
        </div>
        <FaqClient />
      </div>
    </main>
  );
}

