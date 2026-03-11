import type { Frequency, Tier } from "./pricing-types";
import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies: Array<Frequency> = [
  {
    key: FrequencyEnum.Monthly,
    label: "Pay Monthly",
    priceSuffix: "per month",
  },
];

export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Basic,
    id: {
      [FrequencyEnum.Monthly]: 1,
      [FrequencyEnum.Yearly]: 1,
      [FrequencyEnum.OneTime]: 1,
    },
    amount: {
      [FrequencyEnum.Monthly]: 2000,
      [FrequencyEnum.Yearly]: 2000,
      [FrequencyEnum.OneTime]: 2000,
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "AIO",
    price: {
      yearly: "$20",
      monthly: "$20",
      onetime: "$20",
    },
    previousPrice: {
      yearly: "",
      monthly: "",
      onetime: "",
    },
    href: "#",
    featured: true,
    mostPopular: true,
    description: "All-in-one plan with full access to all AI tools.",
    features: {
      yearly: ["100 credits per month", "All tools available", "Email support"],
      monthly: ["100 credits per month", "All tools available", "Email support"],
      onetime: ["100 credits per month", "All tools available", "Email support"],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
];