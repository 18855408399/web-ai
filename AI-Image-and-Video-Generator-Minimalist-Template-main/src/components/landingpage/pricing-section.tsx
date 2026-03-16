"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Check, Sparkles, Zap, Video } from "lucide-react";

const PLAN_CONFIG = {
  monthly: { plan_id: 1, amount: 2000, interval: "month", credits: 600 },
  annual: { plan_id: 2, amount: 18000, interval: "year", credits: 9000 },
};

export default function PricingSection() {
  const { user } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planKey: "monthly" | "annual") => {
    if (!user?.uuid) { toast.error("Please sign in first"); signIn("google"); return; }
    const plan = PLAN_CONFIG[planKey];
    setLoading(planKey);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: plan.plan_id,
          amount: plan.amount,
          interval: plan.interval,
          user_uuid: user.uuid,
          user_email: user.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) { toast.error(data.error || "Checkout failed."); return; }
      if (data.url) { router.push(data.url); }
    } catch (e) {
      toast.error("Checkout failed. Please try again later.");
    } finally { setLoading(null); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch py-12 px-4 relative z-10">
      
      {/* 01. Starter Plan */}
      <div className="bg-zinc-950/60 backdrop-blur-2xl border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col transition-all hover:border-white/15">
        <h3 className="text-base font-bold text-zinc-500 mb-2 uppercase tracking-widest">Starter</h3>
        <div className="text-5xl font-extrabold text-white mb-1">$0</div>
        <p className="text-zinc-500 text-xs mb-8">Test the Cinematic Engine</p>
        <ul className="space-y-3.5 mb-10 flex-grow">
          {["20 free credits", "720P HD Quality", "Kling v2.1 Access", "Watermark on Export"].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm font-medium">
              <Check className="w-4 h-4 text-zinc-600 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => signIn("google")} className="w-full py-3.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 text-white border border-white/10 transition-all font-semibold">
          Claim 20 Credits
        </button>
      </div>

      {/* 02. Monthly Plan */}
      <div className="bg-zinc-900 backdrop-blur-3xl border border-blue-800/50 p-6 md:p-8 rounded-3xl flex flex-col relative shadow-[0_0_60px_rgba(59,130,246,0.1)]">
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1.5 rounded-bl-xl text-[9px] font-bold uppercase tracking-widest mb-4">
          MOST POPULAR
        </div>
        <h3 className="text-base font-bold text-blue-300 mb-2 uppercase tracking-widest">Pro Creator</h3>
        <div className="text-5xl font-extrabold text-white mb-1">$20<span className="text-lg text-zinc-500">/mo</span></div>
        <p className="text-blue-400 text-sm mb-8 font-bold">600 Credits Every Month</p>
        <ul className="space-y-3.5 mb-10 flex-grow">
          {["1080P Full HD", "No Watermark", "Fast Queue (GPU)", "Commercial Usage Rights"].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white text-sm font-medium">
              <Check className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => handleCheckout("monthly")} disabled={!!loading} className="w-full py-4 rounded-xl bg-white text-black font-extrabold text-lg hover:opacity-90 transition-all shadow-xl active:scale-95 disabled:opacity-50">
          {loading === "monthly" ? "Processing..." : "Subscribe Monthly"}
        </button>
      </div>

      {/* 03. Annual Plan (THE "PREMIUM" WINNER) */}
      <div className="premium-border shimmer-effect bg-zinc-900 backdrop-blur-3xl p-6 md:p-8 rounded-3xl flex flex-col relative shadow-[0_0_80px_rgba(255,215,0,0.15)] border-yellow-500/20">
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter shadow-2xl flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-current" /> Save $60 Yearly
        </div>
        <h3 className="text-base font-bold text-yellow-300 mb-2 uppercase tracking-widest">Annual Elite</h3>
        <div className="text-5xl font-extrabold text-white mb-1">$180<span className="text-lg text-zinc-500">/yr</span></div>
        <p className="text-yellow-400 text-sm mb-8 font-extrabold"><span className="text-3xl">9000</span> Credits Yearly</p>
        <ul className="space-y-3.5 mb-10 flex-grow">
          {["≈ 600 Pro Videos", "Highest GPU Priority", "VIP 24/7 Support", "All Monthly Benefits"].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white text-sm font-bold">
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => handleCheckout("annual")} disabled={!!loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-extrabold text-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all shadow-2xl active:scale-95 disabled:opacity-50">
          {loading === "annual" ? "Processing..." : "Claim Elite Savings"}
        </button>
      </div>
    </div>
  );
}