export default function HowItWorksPage() {
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
    <main className="pt-32 pb-24 px-4 sm:px-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            Three Steps to Your AI Video
          </h1>
          <p className="text-white/80 text-base md:text-lg">
            No timeline editor. No software to install. Just upload, prompt, and
            generate.
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
              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 relative z-10 mt-6 md:mt-8">
                {step.title}
              </h2>
              <p className="text-white/70 text-sm md:text-base relative z-10">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

