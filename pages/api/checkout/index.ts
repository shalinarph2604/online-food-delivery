/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {

// make a new order
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res)

        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        const { restaurantId, items, totalPrice, paymentMethod, notes } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in the order' })
        }

        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required' })
        }

        const { data: checkout, error: checkoutError } = await supabase
            .from('checkout')
            .insert([{
                user_id: currentUser.id,
                restaurant_id: restaurantId,
                total_price: totalPrice,
                payment_method: paymentMethod,
                notes: notes || null
            }])
            .select()
            .single()

            if (checkoutError) {
                return res.status(400).json({ message: 'Error creating checkout session' })
            }

        const itemsToInsert = items.map((item: any) => ({
            checkout_id: checkout.id,
            dish_id: item.dishId,
            quantity: item.quantity,
            notes: item.notes || null,
        }))

        const { data: checkoutItems, error: itemsError } = await supabase
            .from('checkout_items')
            .insert(itemsToInsert)
            .select()

            if (itemsError) {
                return res.status(400).json({ message: 'Error creating checkout items' })
            }

            return res.status(200).json({ checkout, checkoutItems })

    } catch (error) {
        console.log(error)
        return res.status(500).end()
    }
}