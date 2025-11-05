/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "@/libs/supabaseAdmin";

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

        const { data, error } = await supabaseAdmin
            .from('restaurants')
            .select('id, name, address, category, rating, image_url')
            .eq('id', restaurantId)
            .single();

        if (error) throw error;

        return res.status(200).json(data);
    } catch (error: any) {
        console.error('Error in restaurant info API:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}


