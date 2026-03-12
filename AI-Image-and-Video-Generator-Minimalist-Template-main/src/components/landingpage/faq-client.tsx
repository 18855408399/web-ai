"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "How do I begin making my first video?",
    a: "Simply upload an image or enter a text prompt, choose your style, and click Generate. Your video will be ready in seconds.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel your subscription anytime from your account settings with just one click.",
  },
  {
    q: "Can I control the animation style?",
    a: "Yes! You can describe the mood, style, and emotion you want in the prompt field — romantic, cinematic, surreal, and more.",
  },
  {
    q: "What billing plans are available?",
    a: "We offer monthly and annual subscription plans. Check our pricing page for full details.",
  },
  {
    q: "What's included in the free trial?",
    a: "The free trial includes a limited number of video generations so you can experience the platform before committing.",
  },
  {
    q: "Which plan offers the best value?",
    a: "The annual plan offers the best value with significant savings compared to monthly billing.",
  },
];

export default function FaqClient() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors duration-200"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
          >
            <span className="text-white font-medium">{faq.q}</span>
            <ChevronDown
              className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-5">
              <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}