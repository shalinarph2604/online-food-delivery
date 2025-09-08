import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/libs/supabase";

// main page, to GET all restaurants
export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }

    try {
        const { data: restaurants, error: restaurantsError } = await supabase
            .from('restaurants')
            .select('*')

        if (restaurantsError) {
            return res.status(400).json({ error: 'Error fetching restaurants' })
        }

        if (!restaurants || restaurants.length === 0) {
            return res.status(404).json({ error: 'No restaurants found' })
        }

        return res.status(200).json(restaurants)

    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }
}