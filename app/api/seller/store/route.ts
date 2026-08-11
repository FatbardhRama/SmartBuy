import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isNonEmptyString } from "@/lib/validation";

function createSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  return session?.user?.id ? session.user : null;
}

async function getRequestBody(request: Request) {
  try {
    const body = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return null;
    }

    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    return NextResponse.json({ store });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch store information." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await getRequestBody(request);
    const name = body?.name;
    const description = body?.description;

    if (!isNonEmptyString(name) || !isNonEmptyString(description)) {
      return NextResponse.json(
        { message: "Store name and description are required." },
        { status: 400 }
      );
    }

    const existingStore = await prisma.store.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (existingStore) {
      return NextResponse.json(
        { message: "You already have a store application." },
        { status: 409 }
      );
    }

    const slug = createSlug(name);

    if (!slug) {
      return NextResponse.json(
        { message: "Store name must include letters or numbers." },
        { status: 400 }
      );
    }

    const duplicateSlug = await prisma.store.findUnique({
      where: {
        slug,
      },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        { message: "A store with that name already exists." },
        { status: 409 }
      );
    }

    const store = await prisma.store.create({
      data: {
        ownerId: user.id,
        name: name.trim(),
        slug,
        description: description.trim(),
        status: "PENDING",
      },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "You already have a store application or that name is unavailable." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Unable to submit your store application." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found." }, { status: 404 });
    }

    if (store.status !== "PENDING" && store.status !== "REJECTED") {
      return NextResponse.json(
        { message: "Store details can only be updated while the application is pending or rejected." },
        { status: 403 }
      );
    }

    const body = await getRequestBody(request);
    const name = body?.name;
    const description = body?.description;

    if (name !== undefined && !isNonEmptyString(name)) {
      return NextResponse.json({ message: "Store name cannot be empty." }, { status: 400 });
    }

    if (description !== undefined && !isNonEmptyString(description)) {
      return NextResponse.json({ message: "Description cannot be empty." }, { status: 400 });
    }

    if (name === undefined && description === undefined) {
      return NextResponse.json({ message: "No store updates supplied." }, { status: 400 });
    }

    const data: { name?: string; description?: string; slug?: string } = {};

    if (isNonEmptyString(name)) {
      const slug = createSlug(name);

      if (!slug) {
        return NextResponse.json(
          { message: "Store name must include letters or numbers." },
          { status: 400 }
        );
      }

      const duplicateSlug = await prisma.store.findFirst({
        where: {
          slug,
          id: {
            not: store.id,
          },
        },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { message: "A store with that name already exists." },
          { status: 409 }
        );
      }

      data.name = name.trim();
      data.slug = slug;
    }

    if (isNonEmptyString(description)) {
      data.description = description.trim();
    }

    const updatedStore = await prisma.store.update({
      where: {
        id: store.id,
      },
      data,
    });

    return NextResponse.json({ store: updatedStore });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "That store name is unavailable." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Unable to update store information." },
      { status: 500 }
    );
  }
}
