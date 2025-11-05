/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import supabaseAdmin from "@/libs/supabaseAdmin";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        // Validate input
        const { email, username, name, password } = req.body
        
        if (!email || !username || !name || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' })
        }

        // Ensure envs exist and create admin client lazily
        const hashedpassword = await bcrypt.hash(password, 8)

        // Check if this email is already registered
        const { data: existingUser, error: existingError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (existingError) {
            return res.status(400).json({ error: existingError.message })
        }

            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' })
            }

        // Insert new user into the database
        const { data: createdUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert([
                {
                    email,
                    username,
                    name,
                    hashedpassword,
                }
            ])
            .select()
            .single();

        if (insertError) {
            return res.status(400).json({ error: insertError.message })
        }
        return res.status(201).json(createdUser);
    } catch (error: any) {
        console.error('Register API Error:', error?.stack ?? error);
        const errorMessage = error?.message || 'Internal server error';
        return res.status(500).json({ error: errorMessage });
    }
    
}