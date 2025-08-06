import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import supabase from "@/libs/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const { email, username, name, password } = req.body
        const hashedpassword = await bcrypt.hash(password, 8)

        // Check if this email is already registered
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' })
            }

        // Insert new user into the database
        const user = await supabase
            .from('users')
            .insert([
                {
                    email,
                    username,
                    name,
                    password: hashedpassword,
                }
            ])
            .select()
            .single();

        return res.status(201).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
}