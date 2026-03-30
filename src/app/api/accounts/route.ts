import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/lib/stack-server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${randomBytes(4).toString("hex")}`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountUsers = await prisma.accountUser.findMany({
      where: { userId: user.id },
      include: { account: true },
    });

    const accounts = accountUsers.map((au) => ({
      id: au.account.id,
      name: au.account.name,
      slug: au.account.slug,
      plan: au.account.plan,
      status: au.account.status,
      role: au.role,
    }));

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error in GET /api/accounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, document, phone, email, address, city, state, zipCode } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    const account = await prisma.account.create({
      data: {
        name,
        slug,
        document,
        phone,
        email,
        address,
        city,
        state,
        zipCode,
        plan: "FREE",
        status: "ACTIVE",
      },
    });

    await prisma.accountUser.create({
      data: {
        accountId: account.id,
        userId: user.id,
        role: "OWNER",
        name: user.displayName || user.primaryEmail?.split("@")[0] || "Usuário",
      },
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/accounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
