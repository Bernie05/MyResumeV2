import { authOptions } from "@/auth";
import NextAuth from "next-auth";

// The handler is used for both GET and POST requests to support NextAuth's authentication flow, which may involve multiple steps and redirects.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
