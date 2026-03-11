/// <reference types="node" />
import { getUserByUuidAndEmail } from "@/backend/service/user";
import { getSubscriptionPlan } from "@/backend/service/subscription_plan";
import { UserSubscriptionStatusEnum } from "@/backend/type/enum/user_subscription_enum";
import { PaymentStatus } from "@/backend/type/enum/payment_status_enum";
import { PaymentHistory } from "@/backend/type/type";
import { createPaymentHistory } from "@/backend/service/payment_history";
import { getUserSubscriptionByUserIdAndStatus } from "@/backend/service/user_subscription";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { plan_id, amount, interval, user_uuid, user_email } =
      await req.json();

    if (user_uuid === undefined || user_email === undefined) {
      return Response.json({ error: "invalid params" }, { status: 401 });
    }

    if (!plan_id || !amount || !interval) {
      return Response.json({ error: "invalid params" }, { status: 400 });
    }

    const user = await getUserByUuidAndEmail(user_uuid, user_email);
    if (!user || user.uuid !== user_uuid) {
      return Response.json({ error: "user not found" }, { status: 401 });
    }

    const subscriptionPlan = await getSubscriptionPlan(plan_id);

    if (
      !subscriptionPlan ||
      Math.round(amount) !== Math.round(subscriptionPlan.price * 100) ||
      subscriptionPlan.is_active === false ||
      subscriptionPlan.interval !== interval
    ) {
      return Response.json(
        { error: "subscription plan not found" },
        { status: 404 }
      );
    }

    if (plan_id !== 1 && plan_id !== 8 && plan_id !== 9) {
      const userSubscriptions = await getUserSubscriptionByUserIdAndStatus(
        user.uuid,
        [
          UserSubscriptionStatusEnum.ACTIVE,
          UserSubscriptionStatusEnum.CANCELLED,
        ]
      );

      if (userSubscriptions.length > 0) {
        return Response.json(
          { error: "You already have an active subscription" },
          { status: 409 }
        );
      }
    }

    const isOneTimePayment = plan_id === 1 || plan_id === 9 || plan_id === 11;

    const createPaymentHistoryRequest: PaymentHistory = {
      id: 0,
      user_id: user.uuid,
      subscription_plans_id: plan_id,
      stripe_price_id: subscriptionPlan.stripe_price_id || "",
      stripe_subscription_id: "",
      stripe_customer_id: "",
      stripe_payment_intent_id: "",
      amount: amount,
      currency: "USD",
      status: PaymentStatus.STARTED,
      created_at: new Date(),
    };

    const paymentHistory = await createPaymentHistory(
      createPaymentHistoryRequest
    );

    if (!paymentHistory || paymentHistory.id === 0) {
      return Response.json(
        { error: "create payment history failed" },
        { status: 500 }
      );
    }

    const creemApiKey = process.env["CREEM_API_KEY"];
    const webBaseUrl = process.env["WEB_BASE_URI"];

    if (!creemApiKey) {
      return Response.json(
        { error: "CREEM_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!webBaseUrl) {
      return Response.json(
        { error: "WEB_BASE_URI is not configured" },
        { status: 500 }
      );
    }

    const creemProductId = "prod_4DQrUCcvmkMZADxupHDaxV";

    if (!creemProductId) {
      return Response.json(
        { error: "Creem product id not found in subscription plan" },
        { status: 500 }
      );
    }

    const creemPayload = {
      product_id: creemProductId,
      request_id: String(paymentHistory.id),
      success_url: `${webBaseUrl}`,
      cancel_url: `${webBaseUrl}/pricing`,
      customer: {
        email: user.email,
      },
      metadata: {
        project: "ai-video-generator",
        interval: String(interval),
        userId: String(user.uuid),
        paymentHistoryId: String(paymentHistory.id),
        credit: String(subscriptionPlan.credit_per_interval ?? 0),
        subscriptionPlanId: String(plan_id),
        isOneTimePayment: String(isOneTimePayment),
      },
    };

    const creemResponse = await fetch("https://api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${creemApiKey}`,
      },
      body: JSON.stringify(creemPayload),
    });

    const creemText = await creemResponse.text();

    let creemData: any = null;
    try {
      creemData = creemText ? JSON.parse(creemText) : null;
    } catch {
      creemData = { raw: creemText };
    }

    if (!creemResponse.ok) {
      console.error("creem checkout failed:", creemData);
      return Response.json(
        {
          error: "create creem checkout failed",
          details: creemData,
        },
        { status: 500 }
      );
    }

    const checkoutUrl =
      creemData?.url ||
      creemData?.checkout_url ||
      creemData?.hosted_checkout_url ||
      creemData?.data?.url ||
      creemData?.data?.checkout_url;

    if (!checkoutUrl) {
      console.error("creem checkout url missing:", creemData);
      return Response.json(
        {
          error: "creem checkout url missing",
          details: creemData,
        },
        { status: 500 }
      );
    }

    return Response.json({
      url: checkoutUrl,
      paymentHistoryId: paymentHistory.id,
    });
  } catch (e) {
    console.error("checkout failed:", e);
    return Response.json({ error: "checkout failed" }, { status: 500 });
  }
}