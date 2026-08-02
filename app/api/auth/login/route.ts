import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  isNonEmptyString,
  isValidEmail,
} from "@/lib/validation";
import { logLoginAttempt } from "@/lib/login-log";

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

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim(),
      },
    });

    if (!user) {
      await logLoginAttempt({
        email: email.trim(),
        success: false,
        headers: req.headers,
      });

      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!passwordMatch) {
      await logLoginAttempt({
        userId: user.id,
        email: email.trim(),
        success: false,
        headers: req.headers,
      });

      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      await logLoginAttempt({
        userId: user.id,
        email: email.trim(),
        success: false,
        headers: req.headers,
      });

      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    await logLoginAttempt({
      userId: user.id,
      email: email.trim(),
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