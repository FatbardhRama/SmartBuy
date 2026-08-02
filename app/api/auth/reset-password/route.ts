import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { isNonEmptyString } from "@/lib/validation";

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

    const { token, password } = body;

    if (!isNonEmptyString(token) || !isNonEmptyString(password)) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    const resetTokens = await prisma.passwordResetToken.findMany();

    let matchingToken = null as
      | {
          id: string;
          userId: string;
          expiresAt: Date;
        }
      | null;

    for (const resetToken of resetTokens) {
      const isMatch = await bcrypt.compare(token.trim(), resetToken.token);

      if (isMatch) {
        matchingToken = {
          id: resetToken.id,
          userId: resetToken.userId,
          expiresAt: resetToken.expiresAt,
        };
        break;
      }
    }

    if (!matchingToken) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    if (matchingToken.expiresAt.getTime() < Date.now()) {
      await prisma.passwordResetToken.delete({
        where: {
          id: matchingToken.id,
        },
      });

      return NextResponse.json(
        { message: "Reset token has expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    await prisma.user.update({
      where: {
        id: matchingToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: matchingToken.userId,
      },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
