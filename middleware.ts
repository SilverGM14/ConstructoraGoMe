// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar si hay sesión activa
  const { data: { session } } = await supabase.auth.getSession()

  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ['/login', '/registro', '/recuperar-password', '/actualizar-password']
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

  // Si no hay sesión y la ruta NO es pública → redirigir a login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay sesión y está en una ruta pública (login, registro, etc.) → redirigir al dashboard
  if (session && isPublicRoute) {
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Opcional: especificar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}