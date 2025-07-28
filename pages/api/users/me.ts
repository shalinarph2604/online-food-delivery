/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/libs/supabase";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        const { data: user, error: errorUser } = await supabase
            .from('users')
            .select('username, name, bio')
            .eq('id', currentUser.id)
            .single();

        if (errorUser) throw new Error('Failed to retrieve user data');
            
        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json(user);

    } catch (error: any) {
        console.error('Error in user profile API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
} 