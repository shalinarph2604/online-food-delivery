/* eslint-disable @typescript-eslint/no-explicit-any */
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

            if (!restaurantId || typeof restaurantId !== 'string') {
                return res.status(400).json({ error: 'Invalid restaurant ID' });
            }

        const { data, error } = await supabase
            .from('dishes')
            .select('*')
            .eq('restaurant_id', restaurantId);

            if (error) throw new Error('Error fetching dishes')

            if (!data) {
                return res.status(404).json({ error: 'Dishes not found' });
            }

        return res.status(200).json(data);

    } catch (error: any) {
        console.error('Error in restaurant menu API:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}