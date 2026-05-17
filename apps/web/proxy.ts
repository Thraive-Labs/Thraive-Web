import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req: NextRequest) {
  let supabaseResponse = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const host = req.headers.get('host') ?? ''

  // Customer portal: app.* subdomain
  if (host.startsWith('app.')) {
    const isAuthPath = /^\/(login|register|forgot-password|verify-email|update-password|auth\/)/.test(
      req.nextUrl.pathname
    )

    if (!user && !isAuthPath) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (user && isAuthPath && !req.nextUrl.pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Block suspended consumers
    if (user && !isAuthPath) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_blocked')
        .eq('id', user.id)
        .single()

      if (profile?.is_blocked) {
        return NextResponse.redirect(new URL('/blocked', req.url))
      }
    }
  }

  // Admin portal: admin.* subdomain
  if (host.startsWith('admin.')) {
    const isLoginPage = req.nextUrl.pathname === '/admin-login'

    if (!user) {
      if (!isLoginPage) return NextResponse.redirect(new URL('/admin-login', req.url))
      return supabaseResponse
    }

    const { data: staff } = await supabase
      .from('staff')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (!staff || !staff.is_active) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin-login?error=access_denied', req.url))
    }

    if (isLoginPage) {
      return NextResponse.redirect(new URL('/admin-dashboard', req.url))
    }

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-staff-role', staff.role as string)

    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
