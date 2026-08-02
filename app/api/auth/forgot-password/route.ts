import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import {
  isNonEmptyString,
  isValidEmail,
} from "@/lib/validation";

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown>;

    try {
      const parsedBody = await req.json();

      if (
        typeof parsedBody !== "object" ||
        parsedBody === null ||
        Array.isArray(parsedBody)
      ) {
        return NextResponse.json(
          { message: "Invalid request body" },
          { status: 400 }
        );
      }

      body = parsedBody as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!isNonEmptyString(email)) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists, password reset instructions have been sent.",
        },
        { status: 200 }
      );
    }

    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    const response: {
      message: string;
      resetToken?: string;
      resetUrl?: string;
    } = {
      message:
        "If an account exists, password reset instructions have been sent.",
    };

    if (process.env.NODE_ENV !== "production") {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

      response.resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
      response.resetToken = rawToken;
    }

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
