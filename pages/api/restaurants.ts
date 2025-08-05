import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/libs/supabase";

export default async function hanlder(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }

    try {
        const restaurants = await supabase
            .from('restaurants')
            .select('*')

        return res.status(200).json(restaurants.data)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: 'Failed to fetch restaurants' })
    }
}