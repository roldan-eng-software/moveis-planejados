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

async function getNextQuoteNumber(accountId: string): Promise<string> {
  const lastQuote = await prisma.quote.findFirst({
    where: { accountId },
    orderBy: { createdAt: "desc" },
  });

  if (!lastQuote) {
    return "0001";
  }

  const lastNumber = parseInt(lastQuote.number, 10);
  return String(lastNumber + 1).padStart(4, "0");
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
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    const quotes = await prisma.quote.findMany({
      where: {
        accountId,
        ...(status ? { status: status as any } : {}),
        ...(clientId ? { clientId } : {}),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        environments: {
          include: {
            items: true,
          },
          orderBy: { orderIndex: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Error in GET /api/quotes:", error);
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
    const { 
      clientId, 
      title, 
      validityDate, 
      notes, 
      terms, 
      marginPercent,
      environments 
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const accountUser = await prisma.accountUser.findFirst({
      where: { userId: user.id },
    });

    const quoteNumber = await getNextQuoteNumber(accountId);

    let subtotal = 0;
    let totalCost = 0;

    const environmentData = environments?.map((env: any, index: number) => {
      const itemsTotal = env.items?.reduce((sum: number, item: any) => {
        const itemTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
        return sum + itemTotal;
      }, 0) || 0;

      const envCost = env.items?.reduce((sum: number, item: any) => {
        const itemCost = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitCost) || 0);
        return sum + itemCost;
      }, 0) || 0;

      subtotal += itemsTotal;
      totalCost += envCost;

      return {
        name: env.name,
        description: env.description,
        orderIndex: index,
        items: {
          create: env.items?.map((item: any, itemIndex: number) => ({
            templateItemId: item.templateItemId,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.quantity || 1,
            unit: item.unit || "un",
            unitCost: item.unitCost || 0,
            unitPrice: item.unitPrice || 0,
            totalCost: (parseFloat(item.quantity) || 0) * (parseFloat(item.unitCost) || 0),
            totalPrice: (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
            marginPercent: item.marginPercent || 0,
            orderIndex: itemIndex,
          })) || [],
        },
      };
    }) || [];

    const discountValue = subtotal * (parseFloat(body.discountPercent) || 0) / 100;
    const finalTotal = subtotal - discountValue;

    const quote = await prisma.quote.create({
      data: {
        accountId,
        clientId,
        createdById: accountUser?.id,
        number: quoteNumber,
        title,
        validityDate: validityDate ? new Date(validityDate) : null,
        notes,
        terms,
        marginPercent: marginPercent || 0,
        discountPercent: body.discountPercent || 0,
        discountValue,
        subtotal,
        totalCost,
        total: finalTotal,
        environments: {
          create: environmentData,
        },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        environments: {
          include: {
            items: true,
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/quotes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
