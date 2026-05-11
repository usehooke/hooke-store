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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Hooke Elite: Sincronização de Sessão com Middleware
      // Definimos um cookie que o Middleware consegue ler no Edge.
      document.cookie = `hooke-admin-token=${idToken}; path=/; max-age=86400; SameSite=Lax`;
      
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
      const userCredential = await signInWithPopup(auth, facebookProvider);
      const idToken = await userCredential.user.getIdToken();
      document.cookie = `hooke-admin-token=${idToken}; path=/; max-age=86400; SameSite=Lax`;
      
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
    // Remove o cookie de sessão
    document.cookie = "hooke-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
