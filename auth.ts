import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const getAuthSecret = (): string => {
  return process.env.AUTH_SECRET?.trim() ?? "";
};

const getOwnerPassword = (): string => {
  return process.env.RESUME_OWNER_PASSWORD?.trim() ?? "";
};

const getSha256Digest = async (value: string): Promise<Uint8Array> => {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return new Uint8Array(buffer);
};

const timingSafeEqual = (left: Uint8Array, right: Uint8Array): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }

  return difference === 0;
};

const passwordsMatch = async (submittedPassword: string): Promise<boolean> => {
  const ownerPassword = getOwnerPassword();

  if (!submittedPassword || !ownerPassword) {
    return false;
  }

  const [submittedDigest, ownerDigest] = await Promise.all([
    getSha256Digest(submittedPassword),
    getSha256Digest(ownerPassword),
  ]);

  return timingSafeEqual(submittedDigest, ownerDigest);
};

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret() || undefined,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/secret/login",
  },
  providers: [
    CredentialsProvider({
      name: "Private Editor",
      credentials: {
        password: {
          label: "Owner password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!(await passwordsMatch(password))) {
          return null;
        }

        return {
          id: "resume-owner",
          name: "Resume Owner",
        };
      },
    }),
  ],
};
