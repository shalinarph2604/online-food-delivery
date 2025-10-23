/* eslint-disable @typescript-eslint/no-explicit-any */
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

        const { itemId, restaurantId } = req.query

        if (!itemId || typeof itemId !== 'string' || !restaurantId || typeof restaurantId !== 'string') {
            return res.status(400).json({ message: 'Invalid dish ID or restaurant ID' })
        }

        if (req.method === 'PATCH') {
            const { quantity, notes } = req.body

            if (quantity < 1 || typeof quantity !== 'number') {
                return res.status(400).json({ message: 'There\'s no item in the cart' })
            }

            const updateItem: any = {}
                if (quantity !== undefined) updateItem.quantity = quantity
                if (notes !== undefined) updateItem.notes = notes

            const { data: updatedCart, error: updatedError } = await supabase 
                .from('cart')
                .update(updateItem)
                .eq('dish_id', itemId)
                .eq('user_id', currentUser.id)
                .eq('restaurant_id', restaurantId)
                .select()
                .single()

                if (updatedError) throw new Error ('Failed to update cart')

            return res.status(200).json(updatedCart)
        }

        if (req.method === 'DELETE') {
            const { data: deletedCart, error: deletedError } = await supabase
                .from('cart')
                .delete()
                .eq('dish_id', itemId)
                .eq('user_id', currentUser.id)
                .eq('restaurant_id', restaurantId)
                .select()
                .single()

                if (deletedError) throw new Error ('Failed to delete cart item')

            return res.status(200).json(deletedCart)
        }

    } catch (error: any) {
        console.error('Error in dish API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}

// User clicks +
// If item is not in cart yet > frontend sends POST /api/cart > server inserts a new row.
// If item is already in cart → frontend sends PATCH /api/cart/:itemId with quantity + 1.

// User clicks -
// If item is in cart with quantity > 1
// If quantity > 1 → frontend sends PATCH /api/cart/:itemId with quantity - 1.
// If quantity === 1 → frontend sends DELETE /api/cart/:itemId to remove the item from cart