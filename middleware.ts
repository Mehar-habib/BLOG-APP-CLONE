// Import the NextAuth middleware function
import NextAuth from "next-auth";

// Import the authentication configuration
import authConfig from "./auth.config";

// Import route constants for handling auth and public access
import {
  apiAuthPrefix,
  authRoutes,
  LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

// Destructure the auth middleware from NextAuth, passing in our config
const { auth: middleware } = NextAuth(authConfig);

// Define the custom middleware logic
export default middleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; // Check if user is authenticated

  // Determine the type of route being accessed
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // API auth route
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname); // Public route
  const isAuthRoute = authRoutes.includes(nextUrl.pathname); // Auth route like /login or /register

  // Allow all API auth routes to proceed without restriction
  if (isApiAuthRoute) return;

  // Redirect logged-in users away from login/register pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // If user is not logged in and tries to access a protected route, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return; // Default: allow request to proceed
});

// Configure which routes the middleware should apply to
export const config = {
  matcher: [
    // Apply middleware to all routes except static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run middleware for API and trpc routes
    "/(api|trpc)(.*)",
  ],
};
