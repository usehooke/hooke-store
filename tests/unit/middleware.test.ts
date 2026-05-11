import { describe, it, expect } from 'vitest';
import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';

describe('Middleware Shield: Segurança de Borda', () => {
  it('Deve bloquear acesso ao /admin sem token de sessão', () => {
    const request = new NextRequest(new URL('http://localhost:3000/admin'));
    const response = middleware(request);
    
    expect(response?.status).toBe(307); // Redirect temporário
    expect(response?.headers.get('location')).toContain('/login');
  });

  it('Deve permitir acesso se o cookie hooke-admin-token estiver presente', () => {
    const request = new NextRequest(new URL('http://localhost:3000/admin'));
    request.cookies.set('hooke-admin-token', 'fake-valid-token');
    
    const response = middleware(request);
    
    // Se for NextResponse.next(), o status geralmente não é definido explicitamente ou é 200 dependendo do mock
    expect(response?.status).not.toBe(307);
  });
});
