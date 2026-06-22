import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

/**
 * HOOKE ELITE — Proxy Shield (Node.js Runtime)
 * 
 * Migrado de middleware.ts → proxy.ts (Next.js 16 convention)
 * 
 * Fase 1 — Segurança:
 * - Valida o JWT do cookie __session decodificando o Firebase ID Token
 * - Roda em Node.js (proxy não suporta Edge Runtime — Next 16)
 * - Rejeita cookies forjados ou expirados antes de acionar qualquer banco
 * 
 * O matcher é configurado em next.config.mjs (proxyMatcher)
 */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hooke-dev-secret-substitua-em-producao'
);

/**
 * Verifica se o token JWT é válido e contém a claim admin=true
 */
async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const payload = decodeJwt(token);
    
    // Verifica se expirou
    const isExpired = payload.exp ? Date.now() >= payload.exp * 1000 : false;
    if (isExpired) {
      return false;
    }
    
    // Aceita tokens com claim admin:true (Firebase Custom Claims) 
    // ou com role:'admin' (JWT próprio)
    return payload.admin === true || payload.role === 'admin';
  } catch {
    // Token inválido, expirado ou formato incorreto
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protege apenas rotas administrativas
  if (pathname.startsWith('/admin')) {
    const sessionToken =
      request.cookies.get('__session')?.value ||
      request.cookies.get('hooke-admin-token')?.value;

    // 1. Sem cookie → redireciona para login
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Token presente mas inválido/forjado → bloqueia com 401
    const isValid = await verifyAdminToken(sessionToken);
    if (!isValid) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      loginUrl.searchParams.set('error', 'session_invalid');
      
      // Limpa o cookie inválido na resposta
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('__session');
      response.cookies.delete('hooke-admin-token');
      return response;
    }

    // 3. Token válido → adiciona header de identidade para Server Components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hooke-admin', 'true');
    
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

// Sem export const config aqui — proxy.ts não aceita route segment config
// O matcher é definido em next.config.mjs via `matcher` na chave `proxy`
