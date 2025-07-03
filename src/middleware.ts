// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Função de middleware
export function middleware(request: NextRequest) {
  // 1. Pega o token do cookie da requisição
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Redireciona para /login se não houver token e a rota for protegida
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Se houver token e o usuário tentar acessar /login, redireciona para o dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Permite que a requisição continue se nenhuma das condições acima for atendida
  return NextResponse.next();
}

// 5. Configuração do Matcher
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};