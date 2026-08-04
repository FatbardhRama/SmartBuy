import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const MAX_CONTEXT_PRODUCTS = 8;
const MAX_CANDIDATES = 24;

const CATEGORY_SIGNALS: Record<string, string[]> = {
  Laptops: ["laptop", "laptops", "notebook", "macbook", "ultrabook"],
  Smartphones: ["smartphone", "smartphones", "phone", "phones", "iphone", "android", "galaxy"],
  Gaming: ["gaming", "game", "controller", "playstation", "xbox"],
  Audio: ["audio", "headphone", "headphones", "earbud", "earbuds", "speaker", "sound"],
  Accessories: ["accessory", "accessories", "mouse", "keyboard", "charger", "cable"],
  Wearables: ["wearable", "wearables", "smartwatch", "watch", "fitness tracker"],
  "Smart Home": ["smart home", "smart-home", "alexa", "nest", "homepod"],
  Monitors: ["monitor", "monitors", "display", "screen"],
};

const INTENT_PROFILES: Record<string, { signals: string[]; categories: string[] }> = {
  programming: {
    signals: ["programming", "developer", "development", "coding", "software engineering"],
    categories: ["Laptops", "Monitors", "Accessories"],
  },
  gaming: {
    signals: ["gaming", "gamer", "game setup", "play games"],
    categories: ["Gaming", "Laptops", "Monitors", "Audio", "Accessories"],
  },
  student: {
    signals: ["student", "school", "studying", "study", "university", "college"],
    categories: ["Laptops", "Smartphones", "Audio", "Accessories"],
  },
  work: {
    signals: ["work", "office", "business", "productivity", "remote work", "working from home"],
    categories: ["Laptops", "Monitors", "Accessories", "Audio"],
  },
  entertainment: {
    signals: ["entertainment", "movies", "movie", "music", "streaming", "watch videos", "video"],
    categories: ["Audio", "Monitors", "Smart Home", "Smartphones"],
  },
};

const UNSUPPORTED_CATEGORY_SIGNALS: Record<string, string[]> = {
  cameras: ["camera", "cameras", "dslr", "mirrorless"],
  drones: ["drone", "drones", "quadcopter"],
  printers: ["printer", "printers", "scanner"],
  tablets: ["tablet", "tablets", "ipad"],
  televisions: ["television", "televisions", "smart tv", " tv"],
};

const STOP_WORDS = new Set([
  "about", "after", "also", "best", "budget", "buy", "choose", "compare", "could", "electronics",
  "find", "from", "good", "have", "help", "looking", "match", "need", "please", "product", "products",
  "recommend", "recommendation", "shopping", "should", "smartbuy", "some", "something", "that", "their",
  "there", "these", "they", "this", "under", "want", "what", "which", "with", "would", "your",
  "affordable", "cheap", "cheaper", "coding", "college", "developer", "development", "entertainment", "gaming",
  "business", "device", "devices", "movie", "movies", "music", "office", "productivity", "programming", "remote",
  "school", "streaming", "student", "students", "study", "studying", "university", "video", "work",
]);

const CATEGORY_ONLY_TERMS = new Set([
  "accessories", "accessory", "audio", "earbud", "earbuds", "game", "gaming", "headphone", "headphones",
  "laptop", "laptops", "monitor", "monitors", "notebook", "phone", "phones", "screen", "smartphone",
  "smartphones", "speaker", "ultrabook", "wearable", "wearables",
]);

export type CatalogConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  seller: string | null;
};

export type ProductContextResult = {
  products: CatalogProduct[];
  context: string;
  status: "matched" | "no-match" | "unclear" | "unsupported";
  unsupportedCategory: string | null;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9€$.,\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function extractCategories(query: string) {
  return Object.entries(CATEGORY_SIGNALS)
    .filter(([, signals]) => signals.some((signal) => query.includes(signal)))
    .map(([category]) => category);
}

function extractIntents(query: string) {
  return Object.entries(INTENT_PROFILES)
    .filter(([, profile]) => profile.signals.some((signal) => query.includes(signal)))
    .map(([intent]) => intent);
}

function extractUnsupportedCategory(query: string) {
  return Object.entries(UNSUPPORTED_CATEGORY_SIGNALS)
    .find(([, signals]) => signals.some((signal) => query.includes(signal)))?.[0] ?? null;
}

function extractBudget(query: string) {
  const qualifiedBudget = query.match(
    /(?:under|below|less than|up to|max(?:imum)?|budget(?: of| is)?)[^0-9]{0,12}(\d+(?:[.,]\d{1,2})?)/i,
  );
  const currencyBudget = query.match(/(?:€|eur)\s*(\d+(?:[.,]\d{1,2})?)|(\d+(?:[.,]\d{1,2})?)\s*(?:€|eur)/i);
  const value = qualifiedBudget?.[1] ?? currencyBudget?.[1] ?? currencyBudget?.[2];
  if (!value) return null;

  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function extractKeywords(query: string) {
  return Array.from(new Set(
    query
      .replace(/[€$]\s*\d+(?:[.,]\d{1,2})?/g, " ")
      .split(/[^a-z0-9-]+/)
      .map((token) => token.replace(/^-|-$/g, ""))
      .filter((token) =>
        token.length >= 3
        && !STOP_WORDS.has(token)
        && !CATEGORY_ONLY_TERMS.has(token)
        && !/^\d+$/.test(token)
      ),
  )).slice(0, 10);
}

function relevanceScore(
  product: { name: string; description: string; category: string; price: number },
  keywords: string[],
  categories: string[],
  budget: number | null,
  preferAffordable: boolean,
) {
  const name = product.name.toLowerCase();
  const description = product.description.toLowerCase();
  const category = product.category.toLowerCase();
  let score = categories.includes(product.category) ? 8 : 0;

  for (const keyword of keywords) {
    if (name.includes(keyword)) score += 5;
    if (category.includes(keyword)) score += 3;
    if (description.includes(keyword)) score += 1;
  }

  if (budget !== null) score += Math.max(0, 2 - Math.abs(budget - product.price) / Math.max(budget, 1));
  if (preferAffordable) score += 4 / (1 + product.price / 500);
  return score;
}

export async function buildProductContext(
  history: CatalogConversationMessage[],
  latestMessage: string,
): Promise<ProductContextResult> {
  const recentUserText = history
    .filter((message) => message.role === "user")
    .slice(-4)
    .map((message) => message.content)
    .concat(latestMessage)
    .join(" ");
  const query = normalize(recentUserText);
  const explicitCategories = extractCategories(query);
  const intents = extractIntents(query);
  const intentCategories = intents.flatMap((intent) => INTENT_PROFILES[intent].categories);
  const categories = Array.from(new Set([...explicitCategories, ...intentCategories]));
  const unsupportedCategory = extractUnsupportedCategory(` ${query}`);
  const budget = extractBudget(query);
  const keywords = extractKeywords(query);
  const comparisonRequested = /\b(compare|comparison|versus|vs\.?|difference|better)\b/.test(query);
  const preferAffordable = budget !== null || intents.includes("student") || /\b(affordable|cheap|cheaper|value)\b/.test(query);

  if (unsupportedCategory && explicitCategories.length === 0 && intents.length === 0) {
    return {
      products: [],
      context: "",
      status: "unsupported",
      unsupportedCategory,
    };
  }

  if (categories.length === 0 && keywords.length === 0 && budget === null && !comparisonRequested) {
    return {
      products: [],
      context: "",
      status: "unclear",
      unsupportedCategory: null,
    };
  }

  const where: Prisma.ProductWhereInput = {
    stock: { gt: 0 },
    store: { is: { status: "APPROVED" } },
    ...(budget !== null ? { price: { lte: budget } } : {}),
    ...(categories.length > 0 ? { category: { in: categories, mode: "insensitive" } } : {}),
    ...(keywords.length > 0
      ? {
          OR: keywords.flatMap((keyword) => [
            { name: { contains: keyword, mode: "insensitive" as const } },
            { description: { contains: keyword, mode: "insensitive" as const } },
            { category: { contains: keyword, mode: "insensitive" as const } },
          ]),
        }
      : {}),
  };

  const candidates = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: MAX_CANDIDATES,
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      description: true,
      stock: true,
      store: { select: { name: true } },
    },
  });

  const products = candidates
    .sort((a, b) =>
      relevanceScore(b, keywords, categories, budget, preferAffordable)
      - relevanceScore(a, keywords, categories, budget, preferAffordable)
      || (preferAffordable ? a.price - b.price : 0)
    )
    .slice(0, MAX_CONTEXT_PRODUCTS)
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description.slice(0, 320),
      stock: product.stock,
      seller: product.store?.name ?? null,
    }));

  return {
    products,
    status: products.length > 0 ? "matched" : "no-match",
    unsupportedCategory: null,
    context: JSON.stringify({
      currency: "EUR",
      shoppingIntent: intents,
      comparisonRequested,
      budgetMaximum: budget,
      requestedCategories: categories,
      availableProducts: products,
    }, null, 2),
  };
}
