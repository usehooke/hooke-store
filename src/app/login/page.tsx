"use client";

import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="w-full min-h-screen bg-zinc-50 flex flex-col items-center justify-center font-sans p-6">
      <LoginForm />
    </main>
  );
}
