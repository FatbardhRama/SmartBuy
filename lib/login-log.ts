import { prisma } from "@/lib/prisma";

function getHeaderValue(headers: Headers | undefined, key: string): string | null {
  const value = headers?.get(key);

  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function getClientIpAddress(headers: Headers | undefined): string | null {
  const forwardedFor = getHeaderValue(headers, "x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return getHeaderValue(headers, "x-real-ip");
}

export function getUserAgent(headers: Headers | undefined): string | null {
  return getHeaderValue(headers, "user-agent");
}

export async function logLoginAttempt({
  userId,
  email,
  success,
  headers,
}: {
  userId?: string | null;
  email: string;
  success: boolean;
  headers: Headers | undefined;
}) {
  try {
    await prisma.loginLog.create({
      data: {
        userId: userId ?? null,
        email: email.trim(),
        success,
        ipAddress: getClientIpAddress(headers),
        userAgent: getUserAgent(headers),
      },
    });
  } catch {
    // Keep login flow resilient if logging fails.
  }
}
