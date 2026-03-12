"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Image as ImageIcon, ChevronDown, Sparkles, 
  ArrowUp, Monitor, Clock, Check, Play, Layers, Zap,
  Plus, Loader2, X, ArrowRight
} from 'lucide-react';

export default function TopLanding() {
  // --- 业务状态管理 ---
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [credits, setCredits] = useState(0); 
  const [prompt, setPrompt] = useState("");
  
  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  // 弹窗状态
  const [showPricingModal, setShowPricingModal] = useState(false);

  // --- 模拟 API 调用逻辑 ---
  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("Please describe the video you want to create.");
      return;
    }
    
    const cost = 2;
    if (credits < cost) {
      setShowPricingModal(true);
      return;
    }

    setCredits(prev => prev - cost);
    setIsGenerating(true);
    setGeneratedResult(null);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      setIsGenerating(false);
      setGeneratedResult("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");
    }, 5000);
  };

  const handleRecharge = (amount: number, addedCredits: number) => {
    setCredits(prev => prev + addedCredits);
    setShowPricingModal(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-zinc-900">
        
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop" 
            alt="Majestic Landscape" 
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-zinc-50"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-50 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-xs tracking-wider">VF</span>
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">VideoFly</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">Tools <ChevronDown className="w-3 h-3" /></a>
            <button onClick={() => setShowPricingModal(true)} className="hover:text-white transition-colors">Pricing</button>
            <a href="#" className="hover:text-white transition-colors">Gallery</a>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => setShowPricingModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">{credits} Credits</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-300 to-zinc-500 border border-white/20 shadow-lg"></button>
              </div>
            ) : (
              <button onClick={() => setIsLoggedIn(true)} className="px-5 py-2 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-all shadow-sm">
                Sign In
              </button>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-32">
          <motion.div 
            className="text-center w-full max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-8">
              <Sparkles className="w-3 h-3 text-zinc-300" />
              Powered by Next-Gen AI Models
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none mb-6 tracking-tighter drop-shadow-lg">
              Imagine it. <br className="hidden md:block" /> 
              <span className="text-white/70">Generate it.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-zinc-200 max-w-3xl mx-auto mb-12 font-light tracking-tight drop-shadow-md">
              Professional AI video creation, simplified. Turn your text and images into cinematic footage in seconds.
            </motion.p>

            {/* Premium Input Box */}
            <motion.div variants={fadeInUp} className="w-full max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/5 rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-2xl">
                
                <div className="flex items-start gap-4 p-4">
                  <button className="w-16 h-16 shrink-0 rounded-2xl border border-dashed border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all bg-black/20">
                    <Plus className="w-6 h-6" />
                  </button>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                    className="w-full bg-transparent text-white text-lg resize-none outline-none min-h-[80px] placeholder-white/40 pt-1 font-medium disabled:opacity-50"
                    placeholder="Describe the cinematic video you want to create..."
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 p-2 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors">
                      <ImageIcon className="w-3.5 h-3.5" /> Text to Video
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors">
                      <Monitor className="w-3.5 h-3.5" /> 16:9 Cinematic
                    </button>
                  </div>

                  <div className="flex items-center gap-4 ml-auto">
                    <span className="text-xs font-medium text-white/50">Cost: 2 Credits</span>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className={`px-6 py-3 rounded-full flex items-center justify-center transition-all font-semibold shadow-lg ${
                        isGenerating 
                          ? 'bg-white/20 text-white cursor-not-allowed' 
                          : 'bg-white text-zinc-900 hover:bg-zinc-200 hover:scale-105'
                      }`}
                    >
                      {isGenerating ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Generate <ArrowUp className="w-4 h-4 transform rotate-45" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 生成结果展示区 */}
            <AnimatePresence>
              {(isGenerating || generatedResult) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  className="w-full max-w-4xl mx-auto mt-8 rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl relative aspect-video shadow-2xl flex items-center justify-center"
                >
                  {isGenerating ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                      <p className="text-white/70 font-medium mb-4">Calling AI Model...</p>
                      <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-300 ease-out"
                          style={{ width: `${generationProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-white/40 text-xs mt-2">{generationProgress}%</p>
                    </div>
                  ) : generatedResult ? (
                    <div className="relative w-full h-full group">
                      <img src={generatedResult} alt="Generated" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors border border-white/30">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </div>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative"
            >
              <button 
                onClick={() => setShowPricingModal(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-10 text-center border-b border-white/10 bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight relative z-10">Upgrade your workflow</h2>
                <p className="text-zinc-400 relative z-10">Get more credits to generate high-quality AI videos.</p>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950">
                <div className="border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-colors bg-white/5 flex flex-col">
                  <h3 className="text-xl font-semibold text-white mb-2">Creator Pack</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white tracking-tighter">$9.90</span>
                  </div>
                  <button onClick={() => handleRecharge(9.90, 100)} className="w-full py-3.5 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors mt-auto">
                    Buy Credits
                  </button>
                </div>

                <div className="border border-white/20 rounded-3xl p-8 relative shadow-2xl shadow-white/5 bg-gradient-to-b from-white/10 to-transparent flex flex-col">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-zinc-900 text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Pro Studio</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white tracking-tighter">$29.90</span>
                  </div>
                  <button onClick={() => handleRecharge(29.90, 500)} className="w-full py-3.5 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-colors shadow-lg mt-auto">
                    Buy Credits
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}