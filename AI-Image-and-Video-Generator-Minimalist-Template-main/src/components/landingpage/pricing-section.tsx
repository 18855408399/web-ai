"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";

/**
 * 💡 这里的配置已经根据你的数据库最新调整：
 * Monthly: 600 Credits | $20
 * Annual: 9000 Credits | $180 (立省 $60)
 */
const PLAN_CONFIG = {
  monthly: { plan_id: 1, amount: 2000, interval: "month", credits: 600 },
  annual: { plan_id: 2, amount: 18000, interval: "year", credits: 9000 },
};

export default function PricingSection() {
  const { user } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleFreeSignup = () => {
    signIn("google");
  };

  const handleCheckout = async (planKey: "monthly" | "annual") => {
    if (!user?.uuid) {
      toast.error("Please sign in first");
      signIn("google");
      return;
    }

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

      if (response.status === 401) {
        signIn("google");
        return;
      }

      if (response.status === 409) {
        toast.error("You already have an active subscription");
        return;
      }

      if (!response.ok) {
        toast.error(data.error || "Checkout failed. Please try again.");
        return;
      }

      if (data.url) {
        router.push(data.url);
      } else {
        toast.error("Invalid response from server");
      }
    } catch (e) {
      console.error("Checkout failed:", e);
      toast.error("Checkout failed. Please try again later.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch py-10">
      {/* ── Free Plan ── */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Free</h3>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">$0</div>
        <p className="text-white/50 text-xs md:text-sm mb-6">Forever free</p>
        <ul className="space-y-3 md:space-y-4 mb-8 flex-grow">
          {[
            "20 credits on signup",
            "720P HD quality",
            "Kling v2.1 Access (15/video)",
            "Flux 1.1 Pro Access (2/image)",
            "Watermark included",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
              <Check className="w-4 h-4 text-white/50 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleFreeSignup}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20"
        >
          Start Free
        </button>
      </div>

      {/* ── Monthly Plan ── */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden">
        <div className="inline-block w-fit px-3 py-1 bg-blue-500/20 rounded-full text-xs font-semibold text-blue-300 mb-4 border border-blue-500/30">
          MOST POPULAR
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Pro Monthly</h3>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          $20<span className="text-base md:text-lg text-white/80 font-normal">/mo</span>
        </div>
        <p className="text-white/50 text-xs md:text-sm mb-6 font-medium text-blue-400">
          600 Credits Every Month
        </p>
        <ul className="space-y-3 md:space-y-4 mb-8 flex-grow">
          {[
            "1080P Full HD quality",
            "No Watermark",
            "Faster generation queue",
            "Commercial usage rights",
            "Priority Support",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white text-sm font-medium">
              <Check className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleCheckout("monthly")}
          disabled={loading === "monthly"}
          className="w-full py-3 rounded-xl bg-white text-black font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50"
        >
          {loading === "monthly" ? "Processing..." : "Subscribe Monthly"}
        </button>
      </div>

      {/* ── Annual Plan (Featured) ── */}
      <div className="bg-gradient-to-b from-blue-600/20 to-purple-600/20 backdrop-blur-2xl border-2 border-blue-500/50 p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.2)]">
        {/* 悬浮诱惑标签 */}
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> BEST VALUE
        </div>
        
        <div className="inline-block w-fit px-3 py-1 bg-green-500/20 rounded-full text-xs font-semibold text-green-300 mb-4 border border-green-500/30">
          SAVE $60 YEARLY
        </div>
        
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Annual Elite</h3>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          $180<span className="text-base md:text-lg text-white/50 font-normal">/yr</span>
        </div>
        <p className="text-white/50 text-xs md:text-sm mb-6">
          <span className="text-white font-bold text-lg">9000</span> Credits Yearly
        </p>
        
        <ul className="space-y-3 md:space-y-4 mb-8 flex-grow">
          {[
            "Only $0.02 per credit",
            "Fastest GPU Priority",
            "Exclusive Beta Features",
            "All Pro Monthly benefits",
            "24/7 VIP Support",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white/90 text-sm font-semibold">
              <Check className="w-4 h-4 text-green-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={() => handleCheckout("annual")}
          disabled={loading === "annual"}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl"
        >
          {loading === "annual" ? "Processing..." : "Subscribe & Save $60"}
        </button>
      </div>
    </div>
  );
}