/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

// to view the cart items and add items to the cart
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        if (req.method === 'GET') {
            const { restaurantId } = req.query

            if (typeof restaurantId !== 'string') {
                return res.status(400).json({ message: 'Invalid restaurant ID' })
            }

            const { data: cart, error: cartError } = await supabase
                .from('cart')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .eq('user_id', currentUser.id);

                if (cartError) throw new Error('Failed to retrieve cart')
                
                if (!cart || cart.length === 0) {
                    return res.status(200).json({ message: 'Your cart is empty' })
                }

            return res.status(200).json(cart)
        }

        if (req.method === 'POST') {
            const { dishId, quantity, restaurantId } = req.body

            if (!dishId || typeof dishId !== 'string' || !quantity || typeof quantity !== 'number') {
                return res.status(400).json({ message: 'Invalid dish ID or quantity' })
            }

            const { data: updatedCart, error: updateError } = await supabase
                .from('cart')
                .insert([
                    {
                        user_id: currentUser.id,
                        restaurant_id: restaurantId,
                        dish_id: dishId,
                        quantity: quantity
                    }
                ])
                .select()
                .single()

                if (updateError) throw new Error('Failed to add item to cart')

            return res.status(200).json(updatedCart)
        }

    } catch (error: any) {
        console.error('Error in cart API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}
