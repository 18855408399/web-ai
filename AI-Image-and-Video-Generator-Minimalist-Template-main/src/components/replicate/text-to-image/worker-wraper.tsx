"use client";

import { useState } from "react";
import Worker from "./worker";

export default function WorkerWrapper({ effectId, promotion, lang }: any) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  // 这里封装了生成逻辑，确保代码完整
  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      // 这里你可以保持原有的生成逻辑调用
      console.log("Generating with prompt:", prompt);
      // 模拟生成过程，实际请对接你的 API
      setTimeout(() => setLoading(false), 2000);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full min-h-[450px]">
      {/* 左侧：输入区 */}
      <div className="bg-zinc-950 p-6 md:p-8 rounded-[1.5rem] border border-zinc-800 flex flex-col gap-5">
        <h3 className="text-xl font-bold text-white tracking-tight">AI Image Studio</h3>
        <p className="text-zinc-500 text-sm">Powered by Flux 1.1 Pro. Describe your vision below.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. 'A futuristic city...'"
          className="w-full h-40 p-4 rounded-xl bg-black border border-zinc-800 text-white focus:border-blue-500 transition-all resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 mt-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg transition-all disabled:opacity-50"
        >
          {loading ? "Rendering..." : "Generate Image (1 Credit)"}
        </button>
      </div>

      {/* 右侧：展示区 (彻底去掉原来的蛋糕图) */}
      <div className="bg-zinc-950 rounded-[1.5rem] border border-zinc-800 flex justify-center items-center relative overflow-hidden p-4 min-h-[400px]">
        {output ? (
          <img src={output} alt="Output" className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="text-center text-zinc-700 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex justify-center items-center text-zinc-600 text-2xl">
              🖼️
            </div>
            <p className="text-sm">Your masterpiece will appear here</p>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}