import { Session } from "next-auth";

export const isAuthenticated = (
  status: string,
  session: Session | null,
): boolean => {
  return status === "authenticated" && Boolean(session);
};
