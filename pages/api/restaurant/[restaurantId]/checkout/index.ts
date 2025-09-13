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

        const { restaurantId, items, paymentMethod, notes } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in the order' })
        }

        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required' })
        }
    
    // fetch user address from "users" table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select("address")
            .eq('id', currentUser.id)
            .single()

        if (userError || !userData) {
            return res.status(400).json({ message: 'Error fetching user data' })
        }

    // calculate total price
        const dishIds = items.map((item: any) => item.dishId)

        const { data: dishesData, error: dishesError } = await supabase
            .from('dishes')
            .select('id, price')
            .in('id', dishIds)

        if (dishesError || !dishesData) {
            return res.status(400).json({ message: 'Error fetching dish data' })
        }

        let totalPrice = 0

        for (const item of items) {
            const dish = dishesData.find(d => d.id === item.dishId)
            if (dish) {
                totalPrice += dish.price * item.quantity
            }
        }

    // checking user balance
        const { data: userBalance, error: balanceError } = await supabase
            .from('users')
            .select('balance')
            .eq('id', currentUser.id)
            .single()

            if (balanceError) {
                return res.status(400).json({ message: 'Error fetching user balance' })
            }
        
        // if payment method is "balance" (using e-money), check if user has enough balance
            if (paymentMethod === 'balance') {
                if (!userBalance || userBalance.balance < totalPrice) {
                    return res.status(400).json({ message: 'Insufficient balance' })
                }
            }

            const updatedBalance = userBalance.balance - totalPrice

            const { error: updateError } = await supabase 
                .from('users')
                .update({ balance: updatedBalance })
                .eq('id', currentUser.id)

                if (updateError) {
                    return res.status(400).json({ message: 'Error updating user balance' })
                }

    // insert data into "checkout" table
        const { data: checkout, error: checkoutError } = await supabase
            .from('checkout')
            .insert([{
                user_id: currentUser.id,
                restaurant_id: restaurantId,
                total_price: totalPrice,
                payment_method: paymentMethod,
                delivery_address: userData.address, // copy the address here from "users" table
                notes: notes || null
            }])
            .select()
            .single()

            if (checkoutError) {
                return res.status(400).json({ message: 'Error creating checkout session' })
            }
    
    // insert items into "checkout_items" table
    // user can order more than 1 item, so we need to loop through the items
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