"use client";

import React, { useEffect, useState, useRef } from "react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Image as ImageIcon,
  ArrowRight,
  Download,
  X,
  Sparkles,
  Video,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Worker(props: {
  lang: string;
  credit: number;
  prompt: string;
  model: string;
  version: string;
  effect_link_name: string;
  promotion: string;
}) {
  const [prompt, setPrompt] = useState(props.prompt || "");
  const [generating, setGenerating] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const { user } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.uuid) fetchUserSubscriptionInfo();
  }, [user?.uuid]);

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    try {
      const info = await fetch("/api/user/get_user_subscription_info", {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      });
      setUserSubscriptionInfo(info);
    } catch (e) {
      console.error("Failed to fetch subscription info:", e);
    }
  };

  const convertImageToFile = async (): Promise<File | null> => {
    if (!image) {
      toast.warning("Please upload a photo first");
      return null;
    }
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      return new File([blob], "input.jpg", { type: "image/jpeg" });
    } catch (err) {
      console.error("Error converting image:", err);
      return null;
    }
  };

  const handleGenerate = async () => {
    let newPrediction: Prediction;

    if (props.credit > 0) {
      if (
        typeof userSubscriptionInfo?.remain_count === "number" &&
        userSubscriptionInfo.remain_count < props.credit
      ) {
        toast.warning("Not enough credits. Please purchase more.");
        return;
      }
    }

    if (!user) {
      toast.warning("Please sign in first");
      await sleep(1000);
      signIn("google");
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const imageFile = await convertImageToFile();
      if (!imageFile) {
        setGenerating(false);
        return;
      }

      if (!prompt || prompt.trim() === "") {
        toast.warning("Please enter a prompt");
        setGenerating(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("model", props.model);
      formData.append("user_id", user?.uuid || "");
      formData.append("user_email", user?.email || "");
      formData.append("effect_link_name", props.effect_link_name);
      formData.append("prompt", prompt);
      formData.append("credit", props.credit.toString());

      const response = await fetch("/api/predictions/img_to_video", {
        method: "POST",
        body: formData,
      });

      newPrediction = await response.json();
      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });
      if (!canContinue) {
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred, please try again");
      setGenerating(false);
      return;
    }

    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(5000);
      const response = await fetch("/api/predictions/" + newPrediction.id);
      newPrediction = await response.json();
      if (response.status !== 200) {
        setError(newPrediction.detail);
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    }

    const runningTime =
      (newPrediction.created_at
        ? new Date().getTime() - new Date(newPrediction.created_at).getTime()
        : -1) / 1000;

    fetch("/api/effect_result/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original_id: newPrediction.id,
        status: newPrediction.status,
        running_time: runningTime,
        updated_at: new Date(),
        original_image_url: "",
        object_key: newPrediction.id,
      }),
    });

    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => setImage(null);

  const outputUrl = prediction?.output
    ? Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Glassmorphism Prompt Box ─── */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col gap-4">
        {/* Credit Balance Badge */}
        {userSubscriptionInfo && (
          <div className="flex justify-end px-2 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span className="font-semibold text-white">
                {userSubscriptionInfo.remain_count}
              </span>{" "}
              credits remaining
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-2 sm:px-4 pt-2 sm:pt-4">
          {/* Uploaded Image Thumbnail */}
          {image && (
            <div className="relative inline-block mb-3">
              <img
                src={image}
                alt="Uploaded"
                className="h-20 w-20 object-cover rounded-xl border border-white/20 shadow-lg"
              />
              <button
                onClick={handleDeleteImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}

          {/* Textarea */}
          <textarea
            placeholder="A cinematic drone shot of a majestic waterfall cascading down a steep cliff, lush green mountains, 8k resolution, photorealistic..."
            className="w-full bg-transparent text-white placeholder-white/50 resize-none outline-none text-base sm:text-lg md:text-xl font-light h-32"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={generating}
          />
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 pb-2 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Upload Image Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium text-white transition-colors border border-white/10"
            >
              <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              {image ? "Change Image" : "Upload Image"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />

            {/* AI Video Label */}
            <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/10 text-xs sm:text-sm font-medium text-white border border-white/10">
              <Video className="w-3 h-3 sm:w-4 sm:h-4" />
              AI Video
            </div>

            {/* Specs */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm text-white/80">
              <span>16:9</span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span>5s</span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span>1080P</span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4 mt-2 md:mt-0">
            <span className="text-xs sm:text-sm text-white/70 font-medium">
              {props.credit} Credits
            </span>

            {generating ? (
              <button
                disabled
                className="bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold cursor-not-allowed whitespace-nowrap"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                {prediction
                  ? prediction.status === "succeeded"
                    ? "Processing..."
                    : prediction.status
                  : "Processing..."}
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                className="bg-white text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-sm font-bold shadow-lg whitespace-nowrap"
              >
                Generate <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Output Area (only visible when active) ─── */}
      <AnimatePresence>
        {(error || prediction) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            {error && (
              <div className="p-6 text-center text-red-400 text-sm">
                {error}
              </div>
            )}

            {prediction && (
              <>
                {outputUrl ? (
                  <div className="relative group">
                    <video
                      src={outputUrl}
                      className="w-full h-auto rounded-3xl"
                      controls
                      autoPlay
                    />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="bg-white/90 text-black px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:bg-white transition-colors"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = outputUrl;
                          link.setAttribute("download", "");
                          link.setAttribute("target", "_blank");
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <Loader2 className="w-12 h-12 animate-spin text-white mb-4" />
                    <span className="text-white/80 font-medium text-sm">
                      {prediction.status}
                    </span>
                    <span className="text-white/50 text-xs mt-1">
                      Please wait 2–3 minutes...
                    </span>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}