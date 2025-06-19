// Routes that don't require authentication
export const publicRoutes = ["/"];

// Routes used for authentication (login/register)
export const authRoutes = ["/login", "/register"];

// Prefix used by NextAuth API endpoints
export const apiAuthPrefix = "/api/auth";

// Route to redirect users to after successful login
export const LOGIN_REDIRECT = "/user/1";
