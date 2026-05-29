"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Input, Button } from "@/components/ui";
import { FaFacebook } from "react-icons/fa";

type AuthMode = "login" | "register" | "reset";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const { loginWithEmail, registerWithEmail, resetPassword, loginWithFacebook, loading, error, success } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      await loginWithEmail(email, password);
    } else if (mode === "register") {
      await registerWithEmail(email, password);
    } else if (mode === "reset") {
      await resetPassword(email);
    }
  };

  const titles: Record<AuthMode, { title: string; subtitle: string }> = {
    login: { title: "Entrar", subtitle: "Acesse sua conta Hooke" },
    register: { title: "Criar Conta", subtitle: "Junte-se ao universo Hooke" },
    reset: { title: "Redefinir Senha", subtitle: "Enviaremos um link de recuperação" },
  };

  return (
    <div className="w-full max-w-md p-10 border-2 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-2">
          {titles[mode].title}
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
          {titles[mode].subtitle}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border-2 border-black bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 border-2 border-black bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block ml-1" htmlFor="email">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            variant="brutalist"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        {mode !== "reset" && (
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block ml-1" htmlFor="password">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              variant="brutalist"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        )}

        {mode === "login" && (
          <button
            type="button"
            onClick={() => setMode("reset")}
            className="text-[10px] text-zinc-400 hover:text-black tracking-widest uppercase font-bold transition-colors block w-full text-right"
          >
            Esqueci minha senha
          </button>
        )}

        <Button
          type="submit"
          variant="brutalist"
          size="lg"
          className="w-full bg-black text-white hover:bg-zinc-900 border-none mt-2"
          disabled={loading}
        >
          {loading
            ? "Processando..."
            : mode === "login"
            ? "Entrar"
            : mode === "register"
            ? "Criar Conta"
            : "Enviar Link"}
        </Button>

        {/* Toggle Login / Cadastro */}
        <div className="text-center pt-2">
          {mode === "login" && (
            <button
              type="button"
              onClick={() => { setMode("register"); }}
              className="text-[10px] text-zinc-400 hover:text-black tracking-widest uppercase font-bold transition-colors"
            >
              Não tem conta? <span className="text-black underline">Cadastre-se</span>
            </button>
          )}
          {mode === "register" && (
            <button
              type="button"
              onClick={() => { setMode("login"); }}
              className="text-[10px] text-zinc-400 hover:text-black tracking-widest uppercase font-bold transition-colors"
            >
              Já tem conta? <span className="text-black underline">Entrar</span>
            </button>
          )}
          {mode === "reset" && (
            <button
              type="button"
              onClick={() => { setMode("login"); }}
              className="text-[10px] text-zinc-400 hover:text-black tracking-widest uppercase font-bold transition-colors"
            >
              ← Voltar ao login
            </button>
          )}
        </div>

        {mode !== "reset" && (
          <>
            <div className="relative my-6 flex items-center py-2">
              <div className="flex-grow border-t border-black/10"></div>
              <span className="flex-shrink-0 mx-4 text-[8px] font-black uppercase tracking-widest text-zinc-300">Ou continue com</span>
              <div className="flex-grow border-t border-black/10"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => loginWithFacebook()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border-2 border-black/10 hover:border-black font-black uppercase tracking-[0.2em] text-[10px] py-6"
            >
              <FaFacebook size={16} />
              Facebook
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
