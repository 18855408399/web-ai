"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Check } from "lucide-react";

/*
 * ⚠️ 重要配置：plan_id 需要和你数据库 subscription_plans 表中的记录匹配。
 *    amount = 价格（美分），例如 $20 = 2000
 *    interval = "month" 或 "year"
 *
 *    如果你数据库目前只有 plan_id=1，需要新建 plan_id=2（年付）：
 *    INSERT INTO subscription_plans (id, name, interval, price, currency, credit_per_interval, stripe_price_id, is_active)
 *    VALUES (2, 'Pro Annually', 'year', 180.00, 'USD', 12000, 'your_creem_product_id', true);
 */
const PLAN_CONFIG = {
  monthly: { plan_id: 1, amount: 2000, interval: "month" },
  annual: { plan_id: 2, amount: 18000, interval: "year" },
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
      {/* ── Free Plan ── */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
          Free
        </h3>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          $0
        </div>
        <p className="text-white/50 text-xs md:text-sm mb-6">Forever free</p>
        <ul className="space-y-3 md:space-y-4 mb-8">
          {[
            "20 credits on signup",
            "720P HD quality",
            "5-second max duration",
            "Watermark included",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-white/80 text-sm"
            >
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

      {/* ── Monthly Plan (Featured) ── */}
      <div className="bg-white/10 backdrop-blur-2xl border border-white/30 p-6 md:p-8 rounded-3xl md:-translate-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-white mb-4">
          MONTHLY
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
          Pro Monthly
        </h3>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          $20
          <span className="text-base md:text-lg text-white/80 font-normal">
            /mo
          </span>
        </div>
        <p className="text-white/50 text-xs md:text-sm mb-6">Billed monthly</p>
        <ul className="space-y-3 md:space-y-4 mb-8">
          {[
            "1000 credits monthly",
            "1080P Full HD quality",
            "No Watermark",
            "Faster generation queue",
            "Commercial usage rights",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-white text-sm font-medium"
            >
              <Check className="w-4 h-4 text-blue-300 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleCheckout("monthly")}
          disabled={loading === "monthly"}
          className="w-full py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "monthly" ? "Processing..." : "Subscribe Monthly"}
        </button>
      </div>

      {/* ── Annual Plan ── */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
          SAVE $60
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
          Pro Annually
        </h3>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          $180
          <span className="text-base md:text-lg text-white/50 font-normal">
            /yr
          </span>
        </div>
        <p className="text-white/50 text-xs md:text-sm mb-6">
          Equals $15/month
        </p>
        <ul className="space-y-3 md:space-y-4 mb-8">
          {[
            "12000 credits yearly",
            "Priority queue (Fastest)",
            "Reference video uploads",
            "Multi-shot generation",
            "Priority support",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-white/80 text-sm"
            >
              <Check className="w-4 h-4 text-white/50 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleCheckout("annual")}
          disabled={loading === "annual"}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "annual" ? "Processing..." : "Subscribe Annually"}
        </button>
      </div>
    </div>
  );
}