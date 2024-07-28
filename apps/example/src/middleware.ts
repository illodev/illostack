import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

import { dashboardRoute, loginRoute } from "@/config/auth";

export default withAuth(
    async function middleware(req: NextRequest) {
        const token = await getToken({ req });
        const isAuth = !!token;
        const isMainPage = req.nextUrl.pathname === "/";
        const isAuthPage = req.nextUrl.pathname.startsWith(loginRoute);

        if (isAuth) {
            if (isAuthPage || isMainPage) {
                return NextResponse.redirect(new URL(dashboardRoute, req.url));
            }

            return NextResponse.next();
        }

        if (!isAuth && !isAuthPage && !isMainPage) {
            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }

            return NextResponse.redirect(
                new URL(
                    `${loginRoute}?from=${encodeURIComponent(from)}`,
                    req.url
                )
            );
        }

        if (isMainPage) {
            const response = NextResponse.next();
            response.headers.set("Cache-Control", "max-age=0");
            return response;
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => {
                return true;
            }
        }
    }
);

export const config = {
    matcher: ["/((?!api|static|.*\\..*|_next|favicon.png|robots.txt).*)"]
};
