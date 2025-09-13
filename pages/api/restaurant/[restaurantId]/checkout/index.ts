/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import supabase from "@/libs/supabase";

<<<<<<< HEAD
// make a new order
=======
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)
export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {

<<<<<<< HEAD
=======
// make a new order
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res)

<<<<<<< HEAD
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
        const { data: userAddress, error: addressError } = await supabase
=======
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
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)
            .from('users')
            .select("address")
            .eq('id', currentUser.id)
            .single()

<<<<<<< HEAD
            if (addressError) throw new Error ('Error fetching user data')

            if (!userAddress) return res.status(422).json({ message: 'You should input your address'}) // user is available, but the address isn't available
=======
        if (userError || !userData) {
            return res.status(400).json({ message: 'Error fetching user data' })
        }
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)

    // calculate total price
        const dishIds = items.map((item: any) => item.dishId)

        const { data: dishesData, error: dishesError } = await supabase
            .from('dishes')
            .select('id, price')
            .in('id', dishIds)

<<<<<<< HEAD
            if (dishesError) throw new Error ('Failed to fetch dishes data')
=======
        if (dishesError || !dishesData) {
            return res.status(400).json({ message: 'Error fetching dish data' })
        }
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)

        let totalPrice = 0

        for (const item of items) {
            const dish = dishesData.find(d => d.id === item.dishId)
            if (dish) {
                totalPrice += dish.price * item.quantity
            }
        }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7728d33 (completed all HTTP method of [checkoutId] api)
    // checking user balance
        const { data: userBalance, error: balanceError } = await supabase
            .from('users')
            .select('balance')
            .eq('id', currentUser.id)
            .single()

<<<<<<< HEAD
            if (balanceError) throw new Error ('Error fetching user balance')
=======
            if (balanceError) {
                return res.status(400).json({ message: 'Error fetching user balance' })
            }
>>>>>>> 7728d33 (completed all HTTP method of [checkoutId] api)
        
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

<<<<<<< HEAD
                if (updateError) throw new Error ('Error updating user balance')

=======
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)
=======
                if (updateError) {
                    return res.status(400).json({ message: 'Error updating user balance' })
                }

>>>>>>> 7728d33 (completed all HTTP method of [checkoutId] api)
    // insert data into "checkout" table
        const { data: checkout, error: checkoutError } = await supabase
            .from('checkout')
            .insert([{
                user_id: currentUser.id,
                restaurant_id: restaurantId,
                total_price: totalPrice,
                payment_method: paymentMethod,
<<<<<<< HEAD
                delivery_address: userAddress.address, // copy the address here from "users" table
=======
                delivery_address: userData.address, // copy the address here from "users" table
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)
                notes: notes || null
            }])
            .select()
            .single()

<<<<<<< HEAD
            if (checkoutError) throw new Error ('Error creating checkout session')
=======
            if (checkoutError) {
                return res.status(400).json({ message: 'Error creating checkout session' })
            }
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)
    
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

<<<<<<< HEAD
            if (itemsError) throw new Error ('Error creating checkout items')

        return res.status(200).json({ checkout, checkoutItems })

    } catch (error: any) {
        console.error('Error in checkout API:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
=======
            if (itemsError) {
                return res.status(400).json({ message: 'Error creating checkout items' })
            }

            return res.status(200).json({ checkout, checkoutItems })

    } catch (error) {
        console.log(error)
        return res.status(500).end()
>>>>>>> 8d5c6f7 (added api for get and edit the current-user who logged in)
    }
}