import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  isNonEmptyString,
  isValidEmail,
} from "@/lib/validation";
import { logLoginAttempt } from "@/lib/login-log";

const MAX_FAILED_ATTEMPTS = 7;
const LOCK_TIME_MINUTES = 30;

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

    const { email, password } = body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      await logLoginAttempt({
        email: normalizedEmail,
        success: false,
        headers: req.headers,
      });

      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        {
          message:
            "Your account has been temporarily locked due to too many failed login attempts. Please try again in 30 minutes.",
        },
        { status: 423 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!passwordMatch) {
      const failedAttempts = user.failedLoginAttempts + 1;

      const updateData: {
        failedLoginAttempts: number;
        lockedUntil?: Date;
      } = {
        failedLoginAttempts: failedAttempts,
      };

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = new Date();
        lockedUntil.setMinutes(
          lockedUntil.getMinutes() + LOCK_TIME_MINUTES
        );

        updateData.lockedUntil = lockedUntil;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      await logLoginAttempt({
        userId: user.id,
        email: normalizedEmail,
        success: false,
        headers: req.headers,
      });

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        return NextResponse.json(
          {
            message:
              "Your account has been locked for 30 minutes due to too many failed login attempts.",
          },
          { status: 423 }
        );
      }

      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      await logLoginAttempt({
        userId: user.id,
        email: normalizedEmail,
        success: false,
        headers: req.headers,
      });

      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    await logLoginAttempt({
      userId: user.id,
      email: normalizedEmail,
      success: true,
      headers: req.headers,
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}