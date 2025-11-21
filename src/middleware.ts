import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Rotas públicas
  const publicRoutes = ['/login', '/cadastro', '/portfolio']
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Se é rota pública ou raiz, permite
  if (isPublicRoute || req.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  // Para rotas protegidas, verifica se tem token de autenticação
  const token = req.cookies.get('sb-access-token')
  
  if (!token && !isPublicRoute && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
