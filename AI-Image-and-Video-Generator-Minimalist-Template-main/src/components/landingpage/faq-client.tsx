"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is AIO and how does it work?",
    a: "AIO is an advanced AI platform that converts your text prompts or static images into high-quality, cinematic videos using state-of-the-art models.",
  },
  {
    q: "How do I begin making my first video?",
    a: "Simply upload an image or enter a text prompt, choose your style, and click Generate. Your video will be ready in seconds.",
  },
  {
    q: "Can I control the animation style?",
    a: "Yes! You can describe the mood, style, and emotion you want in the prompt field — romantic, cinematic, surreal, and more.",
  },
  {
    q: "What's included in the free trial?",
    a: "The free trial includes a limited number of credits so you can experience the platform before committing.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel your subscription anytime. Email our support team and your plan will remain active until the end of your billing period.",
  },
  {
    q: "Do I own the rights to the videos I create?",
    a: "Yes. If you are on a paid plan, you have full commercial rights to the content you generate.",
  },
];

export default function FaqClient() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="space-y-3 md:space-y-4">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
        >
          <button
            className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between text-white font-medium text-sm sm:text-base"
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            <span className="pr-4">{faq.q}</span>
            {open === i ? (
              <Minus className="w-5 h-5 text-white/50 shrink-0" />
            ) : (
              <Plus className="w-5 h-5 text-white/50 shrink-0" />
            )}
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 sm:px-6 pb-4 sm:pb-5 text-white/70 text-sm leading-relaxed"
              >
                {faq.a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}