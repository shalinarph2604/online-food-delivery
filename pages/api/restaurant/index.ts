import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/libs/supabase";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }

    try {
        const { data: restaurants } = await supabase
            .from('restaurants')
            .select('*')

        if (!restaurants || restaurants.length === 0) {
            return res.status(404).json({ error: 'No restaurants found' })
        }

        return res.status(200).json(restaurants)

    } catch (error) {
        console.log(error)
        return res.status(400).end()
    }
}