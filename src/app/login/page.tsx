"use client";

import { CredentialSignIn } from "@stackframe/stack";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-light to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Móveis Planejados</h1>
          <p className="text-text-secondary mt-2">Entrar na sua conta</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
          <CredentialSignIn />
        </div>
        
        <p className="text-center text-text-secondary mt-6">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
