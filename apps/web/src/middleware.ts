import createMiddleware from "next-intl/middleware";

export default createMiddleware({
    locales: ["en"],
    defaultLocale: "en"
});

export const config = {
    // Match only internationalized pathnames
    matcher: ["/", "/(de)/:path*"]
};
