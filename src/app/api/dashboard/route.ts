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
      return NextResponse.json({
        clientsCount: 0,
        quotesCount: 0,
        productionsCount: 0,
        monthlyRevenue: 0,
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [clientsCount, quotesCount, productionsCount, monthlyTransactions] = await Promise.all([
      prisma.client.count({
        where: { accountId, type: "CUSTOMER" },
      }),
      prisma.quote.count({
        where: { accountId, status: { in: ["DRAFT", "PENDING"] } },
      }),
      prisma.production.count({
        where: { accountId, status: { not: "DELIVERED" } },
      }),
      prisma.transaction.aggregate({
        where: {
          accountId,
          type: "INCOME",
          status: "CONFIRMED",
          date: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    const monthlyRevenue = monthlyTransactions._sum.amount || 0;

    return NextResponse.json({
      clientsCount,
      quotesCount,
      productionsCount,
      monthlyRevenue: Number(monthlyRevenue),
    });
  } catch (error) {
    console.error("Error in GET /api/dashboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
