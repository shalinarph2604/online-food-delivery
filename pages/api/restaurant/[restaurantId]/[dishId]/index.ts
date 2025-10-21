/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/libs/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).end()
    }

    try {
        const { dishId, restaurantId } = req.query

        if (!dishId || typeof dishId !== 'string') {
            return res.status(400).json({ error: 'Invalid restaurant ID' })
        }

        const dishQuery = supabase
            .from('dishes')
            .select('*')
            .eq('id', dishId)

        if (restaurantId && typeof restaurantId === 'string') {
            dishQuery.eq('restaurantId', restaurantId)
        }

        const { data: dish, error: errorDish } = await dishQuery.single()

        if (errorDish) throw new Error('Failed to retrieve dish')

        if (!dish) {
            return res.status(400).json({ message: 'Dish not found' })
        }
        
    return res.status(200).json(dish)

    } catch (error: any) {
        console.error('Error in dish API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}