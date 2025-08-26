import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

// to update or remove items from the cart
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'PATCH' && req.method !== 'DELETE') {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        const { dishId, restaurantId } = req.query

        if (!dishId || typeof dishId !== 'string' || !restaurantId || typeof restaurantId !== 'string') {
            return res.status(400).json({ message: 'Invalid dish ID or restaurant ID' })
        }

        if (req.method === 'PATCH') {
            const { quantity, notes } = req.body

            if (quantity < 1 || typeof quantity !== 'number') {
                return res.status(400).json({ message: 'There\'s no item in the cart' })
            }

            const { data: updatedCart, error }= await supabase 
                .from('cart')
                .update({ 
                    quantity,
                    ...(notes !== undefined && { notes }), // only include notes if it's provided 
                })
                .eq('dish_id', dishId)
                .eq('user_id', currentUser.id)
                .eq('restaurant_id', restaurantId)
                .select()
                .single()

                if (error) {
                    return res.status(400).json({ error: 'Failed to update cart' })
                }

                return res.status(200).json(updatedCart)
        }

        if (req.method === 'DELETE') {
            const { data: deletedCart, error } = await supabase
                .from('cart')
                .delete()
                .eq('dish_id', dishId)
                .eq('user_id', currentUser.id)
                .eq('restaurant_id', restaurantId)
                .select()
                .single()

            if (error) {
                return res.status(400).json({ error: 'Failed to delete cart item' } )
            }

            return res.status(200).json(deletedCart)
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'This is our mistakes: Internal server error' })
    }
}

// User klik +

// Kalau item belum ada di cart → frontend kirim POST /api/cart → server insert row baru.

// Kalau item sudah ada di cart → frontend kirim PATCH /api/cart/:itemId dengan quantity + 1.

// User klik -

// Kalau quantity > 1 → frontend kirim PATCH /api/cart/:itemId dengan quantity - 1.

// Kalau quantity = 1 dan user klik - → frontend kirim DELETE /api/cart/:itemId.