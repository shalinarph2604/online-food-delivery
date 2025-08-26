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

            const cart = await supabase
                .from('cart')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .eq('user_id', currentUser.id);

            if (!cart) {
                return res.status(404).json({ message: 'Cart is empty' });
            }

            return res.status(200).json(cart)
        }

        if (req.method === 'POST') {
            const { itemId, quantity, restaurantId } = req.body

            if (!itemId || typeof itemId !== 'string' || !quantity || typeof quantity !== 'number') {
                return res.status(400).json({ message: 'Invalid item ID or quantity' })
            }

            try {
                const updatedCart = await supabase
                    .from('cart')
                    .insert([
                        {
                            user_id: currentUser.id,
                            restaurant_id: restaurantId,
                            item_id: itemId,
                            quantity: quantity
                        }
                    ])
                    .select()
                    .single()

                return res.status(200).json(updatedCart)
            } catch (error) {
                console.log(error);
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: 'Invalid request' });
    }
}
