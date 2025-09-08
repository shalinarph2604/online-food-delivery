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

        const { data: user, error } = await supabase
            .from('users')
            .select('username, name, bio')
            .eq('id', currentUser.id)
            .single();

        if (error || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }
} 