import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/lib/stack-server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user = existingUser;

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    const account = await prisma.account.create({
      data: {
        name: name || "Minha Empresa",
        slug: email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-"),
      },
    });

    const accountUser = await prisma.accountUser.create({
      data: {
        accountId: account.id,
        userId: user.id,
        role: "OWNER",
        name: name || email.split("@")[0],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Conta criada com sucesso!",
      user: { id: user.id, email: user.email },
      account: { id: account.id, name: account.name, slug: account.slug },
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
  }
}
