import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Match "/(protected)" and all its children or subchildren
const isProtectedRoute = createRouteMatcher(["/(protected)note(.*)"]);

export default clerkMiddleware(async (auth: any, req) => {
  // Apply authentication logic only for protected routes
  if (isProtectedRoute(req)) {
    // Protect the route: require the user to be signed in
    return auth.protect();
  }
});

export const config = {
  matcher: [
    // Protect all routes under "/protected/*"
    "/protected/:path*",
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
