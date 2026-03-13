"use client";
import { useState } from "react";
import { Video, Image as ImageIcon } from "lucide-react";

export default function TabSwitcher({
  videoContent,
  imageContent,
}: {
  videoContent: React.ReactNode;
  imageContent: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"video" | "image">("video");

  return (
    <div className="w-full">
      {/* ── 切换按钮 ── */}
      <div className="flex gap-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 w-fit mx-auto">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "video"
              ? "bg-white text-black shadow-lg"
              : "text-white/70 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4" />
          Image to Video
        </button>
        <button
          onClick={() => setActiveTab("image")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "image"
              ? "bg-white text-black shadow-lg"
              : "text-white/70 hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Text to Image
        </button>
      </div>

      {/* ── 内容区域 ── */}
      <div className={activeTab === "video" ? "block" : "hidden"}>
        {videoContent}
      </div>
      <div className={activeTab === "image" ? "block" : "hidden"}>
        {imageContent}
      </div>
    </div>
  );
}