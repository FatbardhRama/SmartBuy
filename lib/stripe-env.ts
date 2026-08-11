import "server-only";

function requiredEnvironmentVariable(name: string, value: string | undefined) {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return normalized;
}

const secretKey = requiredEnvironmentVariable(
  "STRIPE_SECRET_KEY",
  process.env.STRIPE_SECRET_KEY
);
const publishableKey = requiredEnvironmentVariable(
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
const webhookSecret = requiredEnvironmentVariable(
  "STRIPE_WEBHOOK_SECRET",
  process.env.STRIPE_WEBHOOK_SECRET
);
const appUrlValue =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.NEXTAUTH_URL;
const appUrl = requiredEnvironmentVariable(
  "NEXT_PUBLIC_APP_URL or NEXTAUTH_URL",
  appUrlValue
);

if (!secretKey.startsWith("sk_")) {
  throw new Error("STRIPE_SECRET_KEY must be a Stripe secret key.");
}

if (!publishableKey.startsWith("pk_")) {
  throw new Error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a Stripe publishable key."
  );
}

if (!webhookSecret.startsWith("whsec_")) {
  throw new Error("STRIPE_WEBHOOK_SECRET must be a Stripe webhook signing secret.");
}

let parsedAppUrl: URL;
try {
  parsedAppUrl = new URL(appUrl);
} catch {
  throw new Error("The application URL must be a valid absolute URL.");
}

if (parsedAppUrl.protocol !== "http:" && parsedAppUrl.protocol !== "https:") {
  throw new Error("The application URL must use HTTP or HTTPS.");
}

export const stripeEnvironment = Object.freeze({
  secretKey,
  publishableKey,
  webhookSecret,
  appUrl: parsedAppUrl.origin,
});
