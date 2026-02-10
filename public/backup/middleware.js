import { NextResponse } from 'next/server';

export function middleware(request) {
  // メンテナンスモードが有効な場合
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  // メンテナンスページ自体へのアクセスは許可
  if (request.nextUrl.pathname === '/maintenance.html') {
    return NextResponse.next();
  }

  // 静的アセット（CSS、JS、画像、フォント）へのアクセスは許可
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/images') ||
    request.nextUrl.pathname.endsWith('.css') ||
    request.nextUrl.pathname.endsWith('.js') ||
    request.nextUrl.pathname.endsWith('.png') ||
    request.nextUrl.pathname.endsWith('.jpg') ||
    request.nextUrl.pathname.endsWith('.ico') ||
    request.nextUrl.pathname.endsWith('.woff') ||
    request.nextUrl.pathname.endsWith('.woff2')
  ) {
    return NextResponse.next();
  }

  // メンテナンスモードが有効なら、メンテナンスページにリダイレクト
  if (isMaintenanceMode) {
    return NextResponse.rewrite(new URL('/maintenance.html', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
