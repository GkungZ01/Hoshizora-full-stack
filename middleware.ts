import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Middleware options
  callbacks: {
    authorized: ({ req, token }) => {
      // Return true if the user is authorized for the route
      if (req.nextUrl.pathname === "/profile") {
        return !!token; // Require login
      }
      return true; // Allow access to other routes
    },
  },
  pages: {
    signIn: "/auth/signIn", // Redirect unauthenticated users here
  },
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile"],
};
