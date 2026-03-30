import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/lib/stack-server";
import { prisma } from "@/lib/prisma";

async function getAccountId(userId: string): Promise<string | null> {
  const accountUser = await prisma.accountUser.findFirst({
    where: { userId },
  });
  return accountUser?.accountId || null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const clients = await prisma.client.findMany({
      where: {
        accountId,
        ...(type ? { type: type as any } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Error in GET /api/clients:", error);
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

    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, email, phone, document, address, city, state, zipCode, type, source, notes, tags } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        accountId,
        name,
        email,
        phone,
        document,
        address,
        city,
        state,
        zipCode,
        type: type || "LEAD",
        source,
        notes,
        tags: tags || [],
      },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
