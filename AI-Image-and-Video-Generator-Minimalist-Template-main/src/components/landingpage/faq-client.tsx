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
    q: "Do I own the rights to the videos I create?",
    a: "Yes. If you are on a paid plan (Monthly or Annually), you have full commercial rights to the content you generate.",
  },
  {
    q: "How long does video generation take?",
    a: "Typically, a 5-second 1080P video takes about 30-60 seconds to generate, depending on server load and your subscription tier.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. You can cancel your subscription at any time from your account settings. You will retain access to your plan until the end of your billing cycle.",
  },
  {
    q: "How do I begin making my first video?",
    a: "Simply upload an image or enter a text prompt, choose your style, and click Generate. Your video will be ready in seconds.",
  },
  {
    q: "What's included in the free trial?",
    a: "The free trial includes a limited number of credits so you can experience the platform before committing to a paid plan.",
  },
];

export default function FaqClient() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="space-y-3 md:space-y-4">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
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