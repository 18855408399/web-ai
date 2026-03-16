import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createEffectResult } from "@/backend/service/effect_result";
import { genEffectResultId } from "@/backend/utils/genId";
import { generateCheck } from "@/backend/service/generate-_check";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_HOST = process.env.REPLICATE_URL;

export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { detail: "REPLICATE_API_TOKEN is not set" },
        { status: 500 }
      );
    }

    const requestBody = await request.json();
    
    // --- 强制修改 credit 值为 2 ---
    requestBody.credit = 2; 
    const {
      model,
      prompt,
      width,
      height,
      output_format,
      aspect_ratio,
      user_id,
      user_email,
      effect_link_name,
      version,
      credit, // 这里的 credit 已经被上面一行强制改成 2 了
    } = requestBody;

    // 维持你原始的函数调用方式，不做参数修改，避免报错
    const result = await generateCheck(user_id, user_email, credit);
    
    if (result !== 1) {
      return NextResponse.json(
        { detail: "Auth failed or insufficient credits" },
        { status: 500 }
      );
    }

    const options: any = {
      input: { prompt, width, height, output_format, aspect_ratio },
    };

    if (version) {
      options.version = version;
    } else {
      options.model = model;
    }

    if (WEBHOOK_HOST) {
      options.webhook = `${WEBHOOK_HOST}/api/webhook/replicate`;
      options.webhook_events_filter = ["start", "completed"];
    }

    const prediction = await replicate.predictions.create(options);

    if (prediction?.error) {
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    const resultId = genEffectResultId();
    createEffectResult({
      result_id: resultId,
      user_id: user_id,
      original_id: prediction.id,
      effect_id: 0,
      effect_name: effect_link_name,
      prompt: prompt,
      url: "",
      status: "pending",
      original_url: "",
      storage_type: "S3",
      running_time: -1,
      credit: credit, // 此时 credit 是 2
      request_params: JSON.stringify(requestBody),
      created_at: new Date(),
    }).catch((error) => {
      console.error("Failed to create effect result:", error);
    });

    return NextResponse.json(prediction, { status: 201 });

  } catch (error: any) {
    console.error("=== TEXT TO IMAGE ERROR ===", error?.message || error);
    return NextResponse.json(
      { detail: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}