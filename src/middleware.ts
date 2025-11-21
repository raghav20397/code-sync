import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
// matching trpc api calls
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};