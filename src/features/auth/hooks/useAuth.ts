import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, facebookProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const loginWithEmail = async (email: string, password: string, redirectTo = "/admin") => {
    if (!auth) {
      setError("Serviço de autenticação offline.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Hooke Elite: Sincronização de Sessão com Cookies Seguros
      // Definimos ambos os cookies para compatibilidade total com CDNs (como Firebase Hosting) e HTTPS
      const cookieOpts = `; path=/; max-age=86400; SameSite=Lax; Secure`;
      document.cookie = `hooke-admin-token=${idToken}${cookieOpts}`;
      document.cookie = `__session=${idToken}${cookieOpts}`;
      
      // Força recarga completa para garantir que o Next.js leia o cookie no SSR
      window.location.href = redirectTo;
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential' ? 'E-mail ou senha inválidos.' :
                  err.code === 'auth/user-not-found' ? 'Conta não encontrada.' :
                  err.code === 'auth/wrong-password' ? 'Senha incorreta.' :
                  err.code === 'auth/too-many-requests' ? 'Muitas tentativas. Tente novamente mais tarde.' :
                  err.message.replace("Firebase: ", "");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, redirectTo = "/admin") => {
    if (!auth) {
      setError("Serviço de autenticação offline.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      const cookieOpts = `; path=/; max-age=86400; SameSite=Lax; Secure`;
      document.cookie = `hooke-admin-token=${idToken}${cookieOpts}`;
      document.cookie = `__session=${idToken}${cookieOpts}`;
      
      window.location.href = redirectTo;
    } catch (err: any) {
      const msg = err.code === 'auth/email-already-in-use' ? 'Este e-mail já possui uma conta.' :
                  err.code === 'auth/weak-password' ? 'A senha deve ter pelo menos 6 caracteres.' :
                  err.code === 'auth/invalid-email' ? 'E-mail inválido.' :
                  err.message.replace("Firebase: ", "");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      setError("Serviço de autenticação offline.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      const msg = err.code === 'auth/user-not-found' ? 'Nenhuma conta encontrada com este e-mail.' :
                  err.code === 'auth/invalid-email' ? 'E-mail inválido.' :
                  err.message.replace("Firebase: ", "");
      setError(msg);
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
    setSuccess(null);
    try {
      const userCredential = await signInWithPopup(auth, facebookProvider);
      const idToken = await userCredential.user.getIdToken();
      
      const cookieOpts = `; path=/; max-age=86400; SameSite=Lax; Secure`;
      document.cookie = `hooke-admin-token=${idToken}${cookieOpts}`;
      document.cookie = `__session=${idToken}${cookieOpts}`;
      
      window.location.href = redirectTo;
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirectTo = "/login") => {
    if (!auth) return;
    await signOut(auth);
    // Remove os cookies de sessão
    const expireOpts = "; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `hooke-admin-token=${expireOpts}`;
    document.cookie = `__session=${expireOpts}`;
    
    window.location.href = redirectTo;
  };

  return {
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    loginWithFacebook,
    logout,
    loading,
    error,
    success,
  };
}

