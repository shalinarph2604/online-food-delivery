import NextAuth from "next-auth";
import bcrypt from "bcryptjs";

import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import supabase from "../../../libs/supabase";

export const authOptions = {
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }),

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required')
                }

                const user = await supabase.from('users').select('*').eq('email', credentials.email).single();
                if (!user || !user.data.hashedpassword) {
                    throw new Error('No user found with this email') 
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.data.hashedpassword)
                if (!isValidPassword) {
                    throw new Error('Invalid password')
                }

                return {
                    id: user.data.id,
                    email: user.data.email
                }
            },
        })
    ],
}

export default NextAuth(authOptions);