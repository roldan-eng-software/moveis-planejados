import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/lib/stack-server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", user: null },
        { status: 401 }
      );
    }

    const accountUser = await prisma.accountUser.findFirst({
      where: { userId: user.id },
      include: { account: true },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.primaryEmail,
        displayName: user.displayName,
      },
      accountUser: accountUser
        ? {
            id: accountUser.id,
            role: accountUser.role,
            name: accountUser.name,
            accountId: accountUser.accountId,
            accountName: accountUser.account?.name,
          }
        : null,
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
