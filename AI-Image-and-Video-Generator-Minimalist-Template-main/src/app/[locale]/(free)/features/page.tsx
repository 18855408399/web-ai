import { Clock, Image as ImageIcon, Layers, Video } from "lucide-react";

export default function FeaturesPage() {
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

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            What You Can Create
          </h1>
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
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-2 md:mb-3">
                {f.title}
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

