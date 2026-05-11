import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Hooke Elite Security: Middleware Shield
 * Protege todas as rotas de /admin contra acessos não autorizados.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protegemos apenas rotas que começam com /admin
  if (pathname.startsWith('/admin')) {
    // Verificamos a presença de um cookie de sessão (ex: 'hooke-admin-token')
    // Nota: Em produção, este token deve ser validado via Firebase Admin em uma API ou via jose no Edge.
    const session = request.cookies.get('__session')?.value || request.cookies.get('hooke-admin-token')?.value;

    if (!session) {
      // Se não houver sessão, redirecionamos para o login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configuração de matcher para otimização
export const config = {
  matcher: ['/admin/:path*'],
};
