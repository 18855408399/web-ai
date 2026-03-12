"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import DeleteButton from "@/components/button/delete-button";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import CreditInfo from "@/components/landingpage/credit-info";
import { Plus, ArrowRight, Download } from "lucide-react";

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
  const t = useTranslations(props.lang);
  const [prompt, setPrompt] = useState(props.prompt);
  const [generating, setGenerating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const { user } = useAppContext();

  useEffect(() => {
    if (user?.uuid) {
      fetchUserSubscriptionInfo();
    }
  }, [user?.uuid]);

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    const info = await fetch("/api/user/get_user_subscription_info", {
      method: "POST",
      body: JSON.stringify({ user_id: user.uuid }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user subscription info");
      return res.json();
    });
    setUserSubscriptionInfo(info);
    setIsSubscribed(info.subscription_status === "active");
  };

  const convertImageToFile = async (): Promise<File | null> => {
    if (!image) {
      toast.warning("Please upload a photo");
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
        toast.warning("No credit left");
        return;
      }
    }

    if (user === undefined || user === null) {
      toast.warning("Please login first");
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

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("model", props.model);
      formData.append("user_id", user?.uuid || "");
      formData.append("user_email", user?.email || "");
      formData.append("effect_link_name", props.effect_link_name);
      formData.append("prompt", prompt);
      formData.append("credit", props.credit.toString());

      if (prompt === "" || prompt === null || prompt === undefined) {
        toast.warning("Please enter a prompt");
        setGenerating(false);
        return;
      }
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
      console.error("Error occurred, please try again", err);
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
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* ─── LEFT: Input Area ─── */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t("input.title")}</h2>
            <CreditInfo
              credit={userSubscriptionInfo?.remain_count?.toString() || ""}
            />
          </div>

          {/* Upload Area */}
          <label className="relative flex flex-col items-center justify-center h-52 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
            {image ? (
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt="Uploaded"
                  className="h-full w-full object-contain rounded-xl"
                />
                <DeleteButton
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center p-4">
                <Plus className="w-10 h-10 text-white/30 mb-2" />
                <span className="text-sm text-white/50">
                  {t("input.upload-tips")}
                </span>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>

          {/* Prompt */}
          <textarea
            className="w-full p-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 resize-none outline-none focus:border-white/30 transition-colors text-sm"
            placeholder={t("input.promptTips")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />

          {/* Generate Button */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs text-white/50">
              Cost: {props.credit} Credits
            </span>
            {generating ? (
              <Button
                isLoading
                className="bg-white/20 text-white rounded-xl px-6"
              >
                {prediction
                  ? prediction.status === "succeeded"
                    ? "Processing..."
                    : prediction.status
                  : "Processing..."}
              </Button>
            ) : (
              <button
                className="bg-white text-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-sm font-bold shadow-lg"
                onClick={handleGenerate}
              >
                {t("input.createButton")} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ─── RIGHT: Output Area ─── */}
        <div className="w-full md:w-1/2 flex items-center justify-center min-h-52">
          {error && (
            <div className="text-red-400 text-center text-sm">{error}</div>
          )}

          {prediction ? (
            <>
              {prediction.output ? (
                <div className="relative group rounded-2xl overflow-hidden w-full">
                  <video
                    src={prediction.output}
                    className="w-full h-auto rounded-2xl"
                    controls
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-2xl">
                    <button
                      className="bg-white/90 text-black px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = prediction.output || "";
                        link.setAttribute("download", "");
                        link.setAttribute("target", "_blank");
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4" />
                      {t("output.downloadButton")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full bg-white/5 border border-white/10 rounded-2xl py-16">
                  <CircularProgress
                    color="default"
                    aria-label="Loading..."
                    classNames={{ svg: "text-white" }}
                  />
                  <span className="text-white/70 font-medium mt-4 text-sm">
                    {prediction.status}
                  </span>
                  <span className="text-white/40 text-xs mt-1">
                    Please wait 2-3 minutes...
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-white/5 border border-dashed border-white/10 rounded-2xl overflow-hidden">
              <video
                src={props.promotion}
                className="w-full h-auto rounded-2xl"
                loop
                autoPlay
                muted
                playsInline
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}