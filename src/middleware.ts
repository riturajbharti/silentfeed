import { NextResponse,NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"
// This function can be marked `async` if using `await` inside
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
};

export async function middleware(request: NextRequest) {
    // console.log('hi');
    const token=await getToken({req:request});
    const url=request.nextUrl;
    // console.log(url);

    if(token&& 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname ==='/'

        )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

      if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next()
}