import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/products/:path*",
        "/campaigns/:path*",
        "/integrations/:path*",
        "/creatives/:path*",
        "/analytics/:path*",
        "/settings/:path*",
    ],
}
