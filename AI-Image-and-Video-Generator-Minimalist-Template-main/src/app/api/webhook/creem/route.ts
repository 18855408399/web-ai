import crypto from "crypto";
import {
  createUserSubscription,
  updateUserSubscription,
  getUserSubscriptionByUserId,
} from "@/backend/service/user_subscription";
import {
  createCreditUsage,
  getCreditUsageByUserId,
  updateCreditUsage,
} from "@/backend/service/credit_usage";
import {
  CreditUsage,
  PaymentHistory,
  UserSubscription,
} from "@/backend/type/type";
import {
  getPaymentHistoryById,
  updatePaymentHistory,
  createPaymentHistory,
} from "@/backend/service/payment_history";
import { UserSubscriptionStatusEnum } from "@/backend/type/enum/user_subscription_enum";

const webhookSecret = process.env.CREEM_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  try {
    const hmac = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("creem-signature") as string;

  if (!signature || !verifySignature(body, signature)) {
    console.error("Webhook签名验证失败");
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("Creem webhook event type:", event.type);

  try {
    switch (event.type) {

      // 一次性购买 或 订阅首次完成
      case "checkout.completed": {
        console.log("checkout.completed");
        const data = event.data;
        const metadata = data?.metadata;

        if (metadata?.project !== "ai-video-generator") {
          console.log("project not match, return");
          return Response.json({ received: true });
        }

        const isOneTimePayment = metadata?.isOneTimePayment === "true";

        if (isOneTimePayment) {
          // 一次性购买逻辑
          const currentDate = new Date();
          let newPeriodEnd = new Date(currentDate);
          newPeriodEnd.setMonth(currentDate.getMonth() + 1);

          let credit_usage_from_db: CreditUsage = await getCreditUsageByUserId(
            metadata.userId
          );

          if (
            credit_usage_from_db?.period_end &&
            credit_usage_from_db.period_end > newPeriodEnd
          ) {
            newPeriodEnd = new Date(credit_usage_from_db.period_end);
          }

          if (!credit_usage_from_db) {
            const credit_usage: CreditUsage = {
              user_id: metadata.userId,
              user_subscriptions_id: -1,
              is_subscription_active: false,
              used_count: 0,
              period_remain_count: parseInt(metadata.credit),
              period_start: currentDate,
              period_end: newPeriodEnd,
              created_at: new Date(),
            };
            await createCreditUsage(credit_usage);
          } else {
            credit_usage_from_db.period_remain_count =
              credit_usage_from_db.period_remain_count +
              parseInt(metadata.credit);
            credit_usage_from_db.period_end = newPeriodEnd;
            credit_usage_from_db.updated_at = new Date();
            await updateCreditUsage(credit_usage_from_db);
          }

          // 更新支付记录
          let paymentHistory: PaymentHistory = await getPaymentHistoryById(
            metadata.paymentHistoryId
          );
          paymentHistory.stripe_subscription_id = data?.subscription_id || "";
          paymentHistory.stripe_customer_id = data?.customer?.id || "";
          paymentHistory.status = "success";
          await updatePaymentHistory(paymentHistory);
        }

        break;
      }

      // 订阅激活/续费
      case "subscription.active":
      case "subscription.paid": {
        console.log(event.type);
        const data = event.data;
        const metadata = data?.metadata;

        if (metadata?.project !== "ai-video-generator") {
          console.log("project not match, return");
          return Response.json({ received: true });
        }

        const currentDate = new Date();
        const current_period_end = new Date(currentDate);

        if (metadata.interval === "year") {
          current_period_end.setFullYear(currentDate.getFullYear() + 1);
        } else {
          current_period_end.setMonth(currentDate.getMonth() + 1);
        }

        const userSubscription = await getUserSubscriptionByUserId(
          metadata.userId
        );

        // step1: 创建/更新用户订阅
        const operateUserSubscriptionParams: UserSubscription = {
          user_id: metadata.userId,
          subscription_plans_id: parseInt(metadata.subscriptionPlanId),
          stripe_price_id: data?.product_id || "",
          stripe_subscription_id: data?.id || "",
          stripe_customer_id: data?.customer?.id || "",
          status: UserSubscriptionStatusEnum.ACTIVE,
          current_period_start: currentDate,
          current_period_end: current_period_end,
          created_at: new Date(),
        };

        let user_subscriptions: UserSubscription;
        if (userSubscription) {
          user_subscriptions = await updateUserSubscription(
            operateUserSubscriptionParams
          );
        } else {
          user_subscriptions = await createUserSubscription(
            operateUserSubscriptionParams
          );
          if (!user_subscriptions.id) {
            throw new Error("create user_subscriptions failed");
          }
        }

        // step2: 更新积分
        let credit_usage_from_db: CreditUsage = await getCreditUsageByUserId(
          metadata.userId
        );

        if (!credit_usage_from_db) {
          const credit_usage: CreditUsage = {
            user_id: metadata.userId,
            user_subscriptions_id: user_subscriptions.id!,
            is_subscription_active: true,
            used_count: 0,
            period_remain_count: parseInt(metadata.credit),
            period_start: currentDate,
            period_end: current_period_end,
            created_at: new Date(),
          };
          await createCreditUsage(credit_usage);
        } else {
          if (
            credit_usage_from_db.period_remain_count > 0 &&
            credit_usage_from_db.period_end &&
            credit_usage_from_db.period_end >= currentDate &&
            credit_usage_from_db.is_subscription_active === false
          ) {
            credit_usage_from_db.period_remain_count += parseInt(metadata.credit);
          } else {
            credit_usage_from_db.period_remain_count = parseInt(metadata.credit);
          }
          credit_usage_from_db.is_subscription_active = true;
          credit_usage_from_db.period_start = currentDate;
          credit_usage_from_db.period_end = current_period_end;
          credit_usage_from_db.user_subscriptions_id = user_subscriptions.id!;
          credit_usage_from_db.updated_at = new Date();
          await updateCreditUsage(credit_usage_from_db);
        }

        // step3: 更新支付记录
        let paymentHistory: PaymentHistory = await getPaymentHistoryById(
          metadata.paymentHistoryId
        );
        paymentHistory.stripe_subscription_id = data?.id || "";
        paymentHistory.stripe_customer_id = data?.customer?.id || "";
        paymentHistory.stripe_price_id = data?.product_id || "";
        paymentHistory.status = "success";
        paymentHistory.user_id = metadata.userId;
        paymentHistory.created_at = new Date();
        await createPaymentHistory(paymentHistory);

        break;
      }

      // 订阅取消
      case "subscription.canceled":
      case "subscription.expired": {
        console.log(event.type);
        const data = event.data;
        const userId = data?.metadata?.userId;
        console.log("subscription canceled for user:", userId);
        break;
      }

      default:
        console.log(`未处理的事件类型: ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing Creem webhook:", error);
    return Response.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }

  return Response.json({ received: true });
}