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
        const user = await supabase.auth.signUp({
            email: email,
            password: hashedpassword,
            options: {
                data: {
                    username: username,
                    name: name,
                }
            }
        })
        
        return res.status(200).json(user.data.user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'Failed to register user' })
    }
    
}