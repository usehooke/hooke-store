"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Input, Button } from "@/components/ui";
import { Facebook } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginWithEmail, loginWithFacebook, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithEmail(email, password);
  };

  return (
    <div className="w-full max-w-md p-10 border-2 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-2">
          Acesso Restrito
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
          Hooke Command Center
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 border-2 border-black bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block ml-1" htmlFor="email">
            Protocolo de E-mail
          </label>
          <Input
            id="email"
            type="email"
            variant="brutalist"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@hooke.com.br"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block ml-1" htmlFor="password">
            Código de Acesso
          </label>
          <Input
            id="password"
            type="password"
            variant="brutalist"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button
          type="submit"
          variant="brutalist"
          size="lg"
          className="w-full bg-black text-white hover:bg-zinc-900 border-none mt-4"
          disabled={loading}
        >
          {loading ? "Sincronizando..." : "Iniciar Sessão"}
        </Button>

        <div className="relative my-8 flex items-center py-2">
          <div className="flex-grow border-t border-black/10"></div>
          <span className="flex-shrink-0 mx-4 text-[8px] font-black uppercase tracking-widest text-zinc-300">Autenticação Social</span>
          <div className="flex-grow border-t border-black/10"></div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => loginWithFacebook()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-black/10 hover:border-black font-black uppercase tracking-[0.2em] text-[10px] py-6"
        >
          <Facebook size={16} fill="currentColor" stroke="none" />
          Facebook Sync
        </Button>
      </form>
    </div>
  );
}
