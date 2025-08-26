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
                throw new Error('Invalid restaurant ID')
            }

            const { data: cart, error } = await supabase
                .from('cart')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .eq('user_id', currentUser.id);

                if (error) {
                    return res.status(400).json({ error: 'Failed to retrieve cart items' });
                }

                if (!cart) {
                    return res.status(404).json({ message: 'Cart is empty' });
                }

                return res.status(200).json(cart)
        }

        if (req.method === 'POST') {
            const { dishId, quantity, restaurantId } = req.body

            if (!dishId || typeof dishId !== 'string' || !quantity || typeof quantity !== 'number') {
                return res.status(400).json({ message: 'Invalid dish ID or quantity' })
            }

            const { data: updatedCart, error } = await supabase
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

                if (error) {
                    return res.status(400).json({ error: 'Failed to add item to cart' });
                }

                return res.status(200).json(updatedCart)
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'This is our mistakes: Internal server error' });
    }
}
