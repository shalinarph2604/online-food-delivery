/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
// use server-side supabase admin client to avoid RLS issues
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const { restaurantId } = req.query;
        console.log('API GET /api/restaurant/: restaurantId =>', restaurantId, typeof restaurantId);

        if (!restaurantId || typeof restaurantId !== 'string') {
            return res.status(400).json({ error: 'Invalid restaurant ID' });
        }

        const rid = restaurantId.trim();
        console.log('Using restaurantId (trimmed):', `'${rid}'`);

        // server-side query using admin key
        const { data: dishes, error: dishesError } = await supabaseAdmin
            .from('dishes')
            .select(`
                id,
                name,
                restaurant_id,
                price,
                image_url,
                restaurant:restaurants(
                    id,
                    name,
                    address
                )
            `)
            .eq('restaurant_id', rid);

        console.log('Primary query result:', { count: dishes?.length ?? null, dishes, dishesError });

        // also fetch a small sample to inspect table content
        const { data: sample, error: sampleError } = await supabaseAdmin
            .from('dishes')
            .select('id, name, restaurant_id')
            .limit(5);

        console.log('Sample rows:', { sample, sampleError });

        if (dishesError) throw dishesError;

        return res.status(200).json(dishes ?? []);

    } catch (error: any) {
        console.error('Error in restaurant menu API:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}