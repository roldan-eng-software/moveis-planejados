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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const client = await prisma.client.findFirst({
      where: { id, accountId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error in GET /api/clients/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const body = await request.json();

    const client = await prisma.client.updateMany({
      where: { id, accountId },
      data: body,
    });

    if (client.count === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const updatedClient = await prisma.client.findUnique({ where: { id } });

    return NextResponse.json({ client: updatedClient });
  } catch (error) {
    console.error("Error in PUT /api/clients/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const client = await prisma.client.deleteMany({
      where: { id, accountId },
    });

    if (client.count === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/clients/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
