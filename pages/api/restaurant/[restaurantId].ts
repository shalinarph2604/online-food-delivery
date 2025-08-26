import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/libs/supabase";

// to GET the menu of each restaurant
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

        const { data: dishes } = await supabase
            .from('dishes')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (!dishes) {
            return res.status(404).json({ error: 'Dishes not found' });
        }

        return res.status(200).json(dishes);

    } catch (error) {
        console.log(error);
        return res.status(400).end()
    }
}