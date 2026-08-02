import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Missing verification token" },
        { status: 400 }
      );
    }

    const verificationTokens = await prisma.verificationToken.findMany();

    let matchingToken = null as
      | {
          id: string;
          userId: string;
          expiresAt: Date;
        }
      | null;

    for (const verificationToken of verificationTokens) {
      const isMatch = await bcrypt.compare(token.trim(), verificationToken.token);

      if (isMatch) {
        matchingToken = {
          id: verificationToken.id,
          userId: verificationToken.userId,
          expiresAt: verificationToken.expiresAt,
        };
        break;
      }
    }

    if (!matchingToken) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (matchingToken.expiresAt.getTime() < Date.now()) {
      await prisma.verificationToken.delete({
        where: {
          id: matchingToken.id,
        },
      });

      return NextResponse.json(
        { message: "Verification token has expired" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: matchingToken.userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    await prisma.user.update({
      where: {
        id: matchingToken.userId,
      },
      data: {
        emailVerified: true,
      },
    });

    await prisma.verificationToken.delete({
      where: {
        id: matchingToken.id,
      },
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
