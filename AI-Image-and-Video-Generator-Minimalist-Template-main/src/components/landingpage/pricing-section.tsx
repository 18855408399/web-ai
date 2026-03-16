"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Check, Sparkles, Zap } from "lucide-react";

const PLAN_CONFIG = {
  monthly: { plan_id: 1, amount: 2000, interval: "month", credits: 600 },
  annual: { plan_id: 2, amount: 18000, interval: "year", credits: 9000 },
};

export default function PricingSection() {
  const { user } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

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
      if (response.status === 401) { signIn("google"); return; }
      if (response.status === 409) { toast.error("You already have an active subscription"); return; }
      if (!response.ok) { toast.error(data.error || "Checkout failed."); return; }
      if (data.url) { router.push(data.url); }
    } catch (e) {
      toast.error("Checkout failed. Please try again later.");
    } finally { setLoading(null); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch py-10">
      {/* Free Plan */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col transition-all hover:border-white/20">
        <h3 className="text-lg font-semibold text-white/70 mb-2">Starter</h3>
        <div className="text-4xl font-bold text-white mb-1">$0</div>
        <p className="text-white/40 text-xs mb-6">Experience the power</p>
        <ul className="space-y-3 mb-8 flex-grow">
          {["20 free credits", "720P Quality", "Kling v2.1 Access", "Watermark included"].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white/60 text-sm">
              <Check className="w-4 h-4 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => signIn("google")} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all">
          Get Started
        </button>
      </div>

      {/* Monthly Plan */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-3xl flex flex-col relative">
        <div className="inline-block w-fit px-3 py-1 bg-blue-500/20 rounded-full text-[10px] font-bold text-blue-300 mb-4 border border-blue-500/30 tracking-widest uppercase">
          Pro Growth
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Pro Monthly</h3>
        <div className="text-4xl font-bold text-white mb-1">$20<span className="text-lg text-white/50">/mo</span></div>
        <p className="text-blue-400 text-sm mb-6 font-semibold">600 Credits / Month</p>
        <ul className="space-y-3 mb-8 flex-grow">
          {["1080P Full HD", "No Watermark", "Fast Queue", "Commercial Rights"].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white text-sm">
              <Check className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => handleCheckout("monthly")} disabled={!!loading} className="w-full py-3 rounded-xl bg-white text-black font-bold hover:opacity-90 transition-all disabled:opacity-50">
          {loading === "monthly" ? "Connecting..." : "Go Pro Monthly"}
        </button>
      </div>

      {/* Annual Plan (THE BIG WINNER) */}
      <div className="premium-border shimmer-effect bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-3xl p-6 md:p-8 rounded-3xl flex flex-col relative shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-600 text-black px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter shadow-xl flex items-center gap-1">
          <Zap className="w-3 h-3 fill-current" /> MOST VALUE
        </div>
        <div className="inline-block w-fit px-3 py-1 bg-green-500/20 rounded-full text-[10px] font-bold text-green-300 mb-4 border border-green-500/30 tracking-widest uppercase">
          Save $60 Yearly
        </div>
        <h3 className="text-xl font-bold text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Annual Elite</h3>
        <div className="text-4xl font-bold text-white mb-1">$180<span className="text-lg text-white/50">/yr</span></div>
        <p className="text-white/70 text-sm mb-6 font-medium"><span className="text-green-400 text-xl font-black">9000</span> Total Credits</p>
        <ul className="space-y-3 mb-8 flex-grow">
          {["$0.02 Per Credit (Cheapest)", "Highest Priority GPU", "VIP Support 24/7", "All Beta Features"].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white text-sm font-bold">
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => handleCheckout("annual")} disabled={!!loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-lg hover:scale-[1.03] transition-all shadow-2xl active:scale-95 disabled:opacity-50">
          {loading === "annual" ? "Securing Plan..." : "Subscribe & Save $60"}
        </button>
      </div>
    </div>
  );
}