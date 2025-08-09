/* eslint-disable @typescript-eslint/no-explicit-any */
// main page, to GET all restaurants
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
        const { data: restaurants, error: restaurantsError } = await supabase
            .from('restaurants')
            .select('*')

            if (restaurantsError) throw new Error ('Error fetching restaurants' )

            if (!restaurants || restaurants.length === 0) {
                return res.status(404).json({ error: 'No restaurants found' })
            }

        return res.status(200).json(restaurants)

    } catch (error: any) {
        console.error('Error in restaurant API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}