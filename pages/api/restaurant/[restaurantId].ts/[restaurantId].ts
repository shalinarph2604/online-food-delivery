import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/libs/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const { restaurantId } = req.query;

        if (typeof restaurantId !== 'string') {
            throw new Error('Invalid restaurant ID')
        }

        const { data: restaurant } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', restaurantId)
            .single();

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        return res.status(200).json(restaurant);

    } catch (error) {
        console.log(error);
        return res.status(400).end()
    }
}