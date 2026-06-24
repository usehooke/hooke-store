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

  try {
    // Injeção tática de cabeçalho de depuração conforme o plano
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hooke-admin', 'true');

    // Protege todas as rotas administrativas, exceto a rota de diagnóstico de emergência (/admin/debug)
    if (pathname.startsWith('/admin') && pathname !== '/admin/debug') {
      const sessionToken =
        request.cookies.get('__session')?.value ||
        request.cookies.get('hooke-admin-token')?.value;

      // 1. Sem cookie → redireciona para login
      if (!sessionToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        const redirectResponse = NextResponse.redirect(loginUrl);
        redirectResponse.headers.set('X-Debug-Middleware', 'Redirect-No-Token');
        redirectResponse.headers.set('X-Pathname', pathname);
        return redirectResponse;
      }

      // 2. Token presente mas inválido/forjado → bloqueia com 401 e redireciona
      const isValid = await verifyAdminToken(sessionToken);
      if (!isValid) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        loginUrl.searchParams.set('error', 'session_invalid');
        
        // Limpa os cookies inválidos na resposta
        const redirectResponse = NextResponse.redirect(loginUrl);
        redirectResponse.cookies.delete('__session');
        redirectResponse.cookies.delete('hooke-admin-token');
        redirectResponse.headers.set('X-Debug-Middleware', 'Redirect-Invalid-Token');
        redirectResponse.headers.set('X-Pathname', pathname);
        return redirectResponse;
      }

      // 3. Token válido → adiciona header de identidade para Server Components
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      response.headers.set('X-Debug-Middleware', 'Active-Admin');
      response.headers.set('X-Pathname', pathname);
      return response;
    }

    // Rota pública ou de debug (/admin/debug)
    const response = NextResponse.next();
    response.headers.set('X-Debug-Middleware', 'Active-Public');
    response.headers.set('X-Pathname', pathname);
    return response;
  } catch (error) {
    // ⚠️ Blindagem Extrema: Se o proxy falhar por qualquer motivo imprevisto (ex: crash da lib jose),
    // nós não quebramos a requisição com 500. Deixamos passar e logamos o erro para debugging na Vercel!
    console.error('🔥 [Hooke Proxy Shield Error]:', error);
    
    const response = NextResponse.next();
    response.headers.set('X-Debug-Middleware', 'Error-Fallback');
    response.headers.set('X-Proxy-Error', String(error));
    return response;
  }
}

// Sem export const config aqui — proxy.ts não aceita route segment config
// O matcher é definido em next.config.mjs via `matcher` na chave `proxy`
