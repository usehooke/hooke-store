"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, facebookProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Facebook } from "lucide-react";

export default function LoginPage() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const router = useRouter();

 const handleLogin = async (e: React.FormEvent) => {
 e.preventDefault();
 setError("");
 setLoading(true);

 try {
 if (!auth) return;
 await signInWithEmailAndPassword(auth, email, password);
 router.push("/admin");
 } catch (err: unknown) {
 console.error("Erro no login:", err);
 if (err instanceof Error) {
 // Remove o prefixo "Firebase: " para ficar mais limpo se existir
 setError(`Erro: ${err.message.replace("Firebase: ", "")}`);
 } else {
 setError("Credenciais inválidas. Verifique seu e-mail e senha.");
 }
 } finally {
 setLoading(false);
 }
 };

 const handleFacebookLogin = async () => {
 if (!auth) return;
 setError("");
 setLoading(true);
 try {
 await signInWithPopup(auth, facebookProvider);
 router.push("/admin");
 } catch (err: unknown) {
 console.error("Erro no login com Facebook:", err);
 if (err instanceof Error) {
 setError(`Erro Meta: ${err.message.replace("Firebase: ", "")}`);
 } else {
 setError("Falha ao comunicar com a Meta.");
 }
 } finally {
 setLoading(false);
 }
 };

 return (
 <main className="w-full min-h-screen bg-white flex flex-col items-center justify-center font-sans">
 <div className="w-full max-w-md p-8 border border-hooke-900 bg-white">

 <div className="text-center mb-10">
 <h1 className="text-3xl font-black tracking-tighter text-hooke-900">
 Acesso Restrito
 </h1>
 <p className="text-sm text-gray-500 tracking-widest mt-2">
 Painel Administrativo
 </p>
 </div>

 {error && (
 <div className="mb-6 p-4 border border-red-500 bg-red-50 text-red-600 text-sm font-medium tracking-widest text-center">
 {error}
 </div>
 )}

 <form onSubmit={handleLogin} className="space-y-6">
 <div className="space-y-2">
 <label className="text-xs font-bold tracking-widest text-hooke-900 block" htmlFor="email">
 E-mail
 </label>
 <input
 id="email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full border border-hooke-900 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-hooke-900 transition-all rounded-none"
 placeholder="admin@hooke.com.br"
 required
 />
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold tracking-widest text-hooke-900 block" htmlFor="password">
 Senha
 </label>
 <input
 id="password"
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full border border-hooke-900 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-hooke-900 transition-all rounded-none"
 placeholder="••••••••"
 required
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full bg-hooke-900 text-white font-black tracking-widest py-4 text-sm hover:bg-black transition-colors disabled:opacity-70 rounded-none disabled:cursor-not-allowed mt-4"
 >
 {loading ? "Autenticando..." : "Entrar no Painel"}
 </button>

 <div className="relative my-6 flex items-center py-4">
 <div className="flex-grow border-t border-gray-200"></div>
 <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold tracking-widest">OU</span>
 <div className="flex-grow border-t border-gray-200"></div>
 </div>

 <button
 type="button"
 onClick={handleFacebookLogin}
 disabled={loading}
 className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-black tracking-widest py-4 text-sm hover:bg-[#166FE5] transition-colors disabled:opacity-70 rounded-none disabled:cursor-not-allowed mt-4"
 >
 <Facebook size={20} fill="currentColor" stroke="none" />
 {loading ? "Carregando..." : "Entrar com Facebook"}
 </button>
 </form>

 </div>
 </main>
 );
}
