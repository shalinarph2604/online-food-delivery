import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        const { userId, restaurantId, dishId, quantity, totalPrice, }
    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }
}