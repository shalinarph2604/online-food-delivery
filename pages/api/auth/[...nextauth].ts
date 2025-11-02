/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";

import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import supabase from "../../../libs/supabase";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env (.env.local)");
}
if (!process.env.NEXTAUTH_SECRET || !process.env.NEXTAUTH_URL) {
  throw new Error("Missing NEXTAUTH_SECRET or NEXTAUTH_URL in env (.env.local)");
}

console.log('SUPABASE_URL=', process.env.SUPABASE_URL)
console.log('SERVICE_ROLE=', Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY))
console.log('NEXTAUTH_SECRET=', Boolean(process.env.NEXTAUTH_SECRET))

export const authOptions = {
    adapter: SupabaseAdapter({
        // server-only env (service role)
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log('authorize called', credentials?.email)
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", credentials.email)
                    .single();
                
                    console.log('found user row:', user?.data ?? user)

                if (!user || !user.data?.hashedpassword) {
                    throw new Error("No user found with this email");
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.data.hashedpassword
                );
                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.data.id,
                    email: user.data.email,
                };
            },
        })
    ],

    session: {
        strategy: "jwt" as const,
    },

    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.id = (user as any).id;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
