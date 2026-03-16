"use client";

import { toast } from "sonner";
import { signIn } from "next-auth/react";

interface ErrorHandlingParams {
  response: Response;
  newPrediction: any;
  router: any;
}

export const handleApiErrors = async ({
  response,
  newPrediction,
  router,
}: ErrorHandlingParams): Promise<boolean> => {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  if (response.status === 401) {
    toast("Welcome! Please sign in to save your work.", {
      description: "Redirecting to secure login...",
    });
    await sleep(1500);
    await signIn("google");
    return false;
  }

  if (response.status === 402) {
    toast.error("Credits Exhausted", {
      description: "Redirecting to Pricing for a quick top-up.",
    });
    await sleep(1500);
    router.push("/pricing");
    return false;
  }

  if (response.status === 403) {
    toast.warning("Usage Limit Reached", {
      description: "Your monthly quota is full. Upgrade to Annual for unlimited flow.",
    });
    return false;
  }

  if (response.status !== 201) {
    toast.error("Generation Failed", {
      description: newPrediction.detail || "The AI engine is currently busy. Try in 30 seconds.",
    });
    return false;
  }

  // 成功启动时给用户一个心理预期
  toast.success("Engine Started!", {
    description: "Kling 2.1 is rendering your cinematic video. Estimated: 120s.",
  });

  return true;
};