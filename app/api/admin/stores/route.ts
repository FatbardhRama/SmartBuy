import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isNonEmptyString, isValidId } from "@/lib/validation";

const storeStatuses = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const;

async function getAdminUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }

  return { user: session.user };
}

export async function GET() {
  try {
    const result = await getAdminUser();

    if (result.error) {
      return result.error;
    }

    const stores = await prisma.store.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ stores });
  } catch {
    return NextResponse.json({ message: "Failed to fetch stores." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const result = await getAdminUser();

    if (result.error) {
      return result.error;
    }

    let body: Record<string, unknown>;

    try {
      const parsed = await request.json();

      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
      }

      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const { id, status } = body;

    if (!isNonEmptyString(id) || !isValidId(id)) {
      return NextResponse.json({ message: "Invalid store id." }, { status: 400 });
    }

    if (typeof status !== "string" || !storeStatuses.includes(status as (typeof storeStatuses)[number])) {
      return NextResponse.json({ message: "Invalid store status." }, { status: 400 });
    }

    const store = await prisma.store.update({
      where: {
        id: id.trim(),
      },
      data: {
        status: status as (typeof storeStatuses)[number],
      },
    });

    return NextResponse.json({ store });
  } catch {
    return NextResponse.json({ message: "Unable to update store status." }, { status: 500 });
  }
}
