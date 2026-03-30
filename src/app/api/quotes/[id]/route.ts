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
    const { id } = await params;
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const quote = await prisma.quote.findFirst({
      where: {
        id,
        accountId,
      },
      include: {
        client: true,
        createdBy: {
          select: {
            id: true,
            name: true,
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

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Error in GET /api/quotes/[id]:", error);
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
    const { id } = await params;
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const existingQuote = await prisma.quote.findFirst({
      where: { id, accountId },
    });

    if (!existingQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const body = await request.json();
    const { 
      clientId, 
      title, 
      status,
      validityDate, 
      notes, 
      terms, 
      marginPercent,
      discountPercent,
      environments 
    } = body;

    let subtotal = 0;
    let totalCost = 0;

    if (environments) {
      await prisma.quoteEnvironment.deleteMany({
        where: { quoteId: id },
      });

      const environmentData = environments.map((env: any, index: number) => {
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
          quoteId: id,
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
      });

      await prisma.quoteEnvironment.createMany({
        data: environmentData,
      });
    } else {
      const currentEnvironments = await prisma.quoteEnvironment.findMany({
        where: { quoteId: id },
        include: { items: true },
      });

      for (const env of currentEnvironments) {
        for (const item of env.items) {
          subtotal += parseFloat(item.totalPrice.toString());
          totalCost += parseFloat(item.totalCost.toString());
        }
      }
    }

    const discountValue = subtotal * (parseFloat(discountPercent) || parseFloat(existingQuote.discountPercent.toString()) || 0) / 100;
    const finalTotal = subtotal - discountValue;

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(status && { 
          status,
          ...(status === "APPROVED" && { approvedAt: new Date() }),
          ...(status === "REJECTED" && { rejectedAt: new Date() }),
        }),
        ...(clientId !== undefined && { clientId }),
        validityDate: validityDate ? new Date(validityDate) : validityDate,
        notes,
        terms,
        marginPercent: marginPercent ?? existingQuote.marginPercent,
        discountPercent: discountPercent ?? existingQuote.discountPercent,
        discountValue,
        subtotal,
        totalCost,
        total: finalTotal,
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

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Error in PUT /api/quotes/[id]:", error);
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
    const { id } = await params;
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getAccountId(user.id);
    if (!accountId) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const existingQuote = await prisma.quote.findFirst({
      where: { id, accountId },
    });

    if (!existingQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    await prisma.quote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/quotes/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
