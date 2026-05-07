import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, facebookProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loginWithEmail = async (email: string, password: string, redirectTo = "/admin") => {
    if (!auth) {
      setError("Serviço de autenticação offline.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async (redirectTo = "/admin") => {
    if (!auth) {
      setError("Serviço de autenticação offline.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, facebookProvider);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirectTo = "/login") => {
    if (!auth) return;
    await signOut(auth);
    router.push(redirectTo);
  };

  return {
    loginWithEmail,
    loginWithFacebook,
    logout,
    loading,
    error,
  };
}
