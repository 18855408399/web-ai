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
  Clock,
  MonitorPlay,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ASPECT_RATIOS = [
  { label: "16:9", value: "16:9", desc: "Landscape" },
  { label: "9:16", value: "9:16", desc: "Portrait" },
  { label: "1:1",  value: "1:1",  desc: "Square"    },
];

const DURATIONS = [
  { label: "5s",  value: "5"  },
  { label: "10s", value: "10" },
];

export default function Worker(props: {
  lang: string;
  credit: number;
  prompt: string;
  model: string;
  version: string;
  effect_link_name: string;
  promotion: string;
}) {
  const [prompt, setPrompt]       = useState(props.prompt || "");
  const [generating, setGenerating] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration]   = useState("5");
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
      toast.warning("Please upload a start image — it is required for video generation.");
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

    if (!user) {
      toast.warning("Please sign in first.");
      await sleep(1000);
      signIn("google");
      return;
    }

    if (!image) {
      toast.warning("A start image is required. Please upload one before generating.");
      return;
    }

    if (!prompt || prompt.trim() === "") {
      toast.warning("Please enter a motion prompt describing what should happen in the video.");
      return;
    }

    if (props.credit > 0) {
      if (
        typeof userSubscriptionInfo?.remain_count === "number" &&
        userSubscriptionInfo.remain_count < props.credit
      ) {
        toast.warning("Not enough credits. Please purchase more to continue.");
        return;
      }
    }

    try {
      setGenerating(true);
      setError(null);

      const imageFile = await convertImageToFile();
      if (!imageFile) {
        setGenerating(false);
        return;
      }

      const formData = new FormData();
      formData.append("image",            imageFile);
      formData.append("model",            props.model);
      formData.append("user_id",          user?.uuid || "");
      formData.append("user_email",       user?.email || "");
      formData.append("effect_link_name", props.effect_link_name);
      formData.append("prompt",           prompt);
      formData.append("credit",           props.credit.toString());
      formData.append("aspect_ratio",     aspectRatio);
      formData.append("duration",         duration);

      const response = await fetch("/api/predictions/img_to_video", {
        method: "POST",
        body: formData,
      });

      newPrediction = await response.json();
      const canContinue = await handleApiErrors({ response, newPrediction, router });
      if (!canContinue) {
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred. Please try again.");
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
        original_id:       newPrediction.id,
        status:            newPrediction.status,
        running_time:      runningTime,
        updated_at:        new Date(),
        original_image_url: "",
        object_key:        newPrediction.id,
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

  const outputUrl = prediction?.output
    ? Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
    : null;

  return (
    <div className="flex flex-col gap-6">

      {/* ─── Input Card ─── */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col gap-5">

        {/* Credit Badge */}
        {userSubscriptionInfo && (
          <div className="flex justify-end px-2 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span className="font-semibold text-white">{userSubscriptionInfo.remain_count}</span>
              &nbsp;credits remaining
            </div>
          </div>
        )}

        {/* ── Step 1: Upload Image (Required) ── */}
        <div className="px-2 sm:px-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Step 1 — Start Image
            </span>
            <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">
              Required
            </span>
          </div>

          {image ? (
            <div className="relative inline-block">
              <img
                src={image}
                alt="Uploaded start image"
                className="h-24 w-24 object-cover rounded-xl border border-white/20 shadow-lg"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white w-full sm:w-auto"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">Click to upload a photo</div>
                <div className="text-xs text-white/50">JPG · PNG · WebP</div>
              </div>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>

        {/* ── Step 2: Motion Prompt ── */}
        <div className="px-2 sm:px-4">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider block mb-2">
            Step 2 — Motion Prompt
          </span>
          <textarea
            placeholder="Describe the motion you want: e.g. 'camera slowly zooms in, the person smiles and turns their head, golden hour lighting'"
            className="w-full bg-transparent text-white placeholder-white/40 resize-none outline-none text-sm sm:text-base font-light h-24"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={generating}
          />
        </div>

        {/* ── Step 3: Settings ── */}
        <div className="px-2 sm:px-4 flex flex-col sm:flex-row gap-5">

          {/* Aspect Ratio */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MonitorPlay className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Aspect Ratio
              </span>
            </div>
            <div className="flex gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value)}
                  disabled={generating}
                  className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-all border disabled:opacity-40 ${
                    aspectRatio === ar.value
                      ? "bg-white text-black border-white shadow-lg"
                      : "bg-white/10 text-white/70 border-white/10 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <span className="font-bold">{ar.label}</span>
                  <span className={`text-xs mt-0.5 ${aspectRatio === ar.value ? "text-black/50" : "text-white/40"}`}>
                    {ar.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="sm:max-w-[160px]">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Duration
              </span>
            </div>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  disabled={generating}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all border disabled:opacity-40 ${
                    duration === d.value
                      ? "bg-white text-black border-white shadow-lg"
                      : "bg-white/10 text-white/70 border-white/10 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex items-center justify-between gap-4 px-2 pb-2 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            {image && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors border border-white/10"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Change Image
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white/50">
              <Video className="w-3.5 h-3.5" />
              Image → Video · Kling v2.1
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60 font-medium whitespace-nowrap">
              {props.credit} Credits / generation
            </span>
            {generating ? (
              <button
                disabled
                className="bg-white/20 text-white px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold cursor-not-allowed whitespace-nowrap"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                {prediction?.status ?? "Processing..."}
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                className="bg-white text-black px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-sm font-bold shadow-lg whitespace-nowrap"
              >
                Generate <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Output Area ─── */}
      <AnimatePresence>
        {(error || prediction) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            {error && (
              <div className="p-6 text-center text-red-400 text-sm">{error}</div>
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
                        Download Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <Loader2 className="w-12 h-12 animate-spin text-white mb-4" />
                    <span className="text-white/80 font-medium text-sm">
                      {prediction.status}
                    </span>
                    <span className="text-white/50 text-xs mt-2 text-center">
                      Video generation takes 2–3 minutes.
                      <br />
                      You can safely leave and check results later in My Workspace.
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