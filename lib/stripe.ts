import "server-only";

import Stripe from "stripe";

import { stripeEnvironment } from "@/lib/stripe-env";

export const stripe = new Stripe(stripeEnvironment.secretKey, {
  appInfo: {
    name: "SmartBuy",
  },
});
