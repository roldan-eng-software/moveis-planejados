"use client";

import { CredentialSignUp } from "@stackframe/stack";
import Link from "next/link";

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-light to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Móveis Planejados</h1>
          <p className="text-text-secondary mt-2">Crie sua conta</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
          <CredentialSignUp />
        </div>
        
        <p className="text-center text-text-secondary mt-6">
          Já tem uma conta?{" "}
          <Link href="/handler/sign-in" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
